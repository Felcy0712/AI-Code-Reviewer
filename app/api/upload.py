from pathlib import Path
import traceback

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
)
from sqlalchemy.orm import Session

from time import perf_counter

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.project import Project
from app.models.review import Review
from app.models.evaluation import Evaluation

from app.services.file_service import extract_zip
from app.services.code_reader import read_source_files
from app.services.code_loader import load_code
from app.services.chunker import chunk_code
from app.services.llm_service import review_code
from app.services.evaluation_services import evaluate_review

from app.rag.vector_store import store_embedding
from app.rag.retriever import search_code


router = APIRouter()

UPLOAD_DIR = Path("data/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/upload")
async def upload_project(
    file: UploadFile = File(...),
    review_mode: str = Form("project"),
    selected_file: str | None = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    project = Project(
        user_id=current_user.id,
        name=Path(file.filename).stem,
        filename=file.filename,
        status="processing",
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    try:

        print("DEBUG filename:", file.filename)
        print("DEBUG review_mode:", review_mode)
        print("DEBUG selected_file:", selected_file)

        # Save uploaded ZIP
        file_path = UPLOAD_DIR / file.filename

        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        # Extract ZIP
        extract_path = extract_zip(file_path)

        # Find source files
        files = read_source_files(extract_path)

        # Validate review mode
        if review_mode not in {"project", "file"}:
            raise HTTPException(
                status_code=400,
                detail="Invalid review mode.",
            )

        # Validate selected file only for file review
        if review_mode == "file":

            if not selected_file:
                raise HTTPException(
                    status_code=400,
                    detail="Please select a file to review.",
                )

            selected_file = Path(selected_file).name

            if not any(
                source_file.name == selected_file
                for source_file in files
            ):
                raise HTTPException(
                    status_code=400,
                    detail="Selected file was not found.",
                )

        # Store project code
        all_code = ""
        selected_file_chunk_count = 0
        selected_file_code = ""

        # Process source files
        for source_file in files:

            code = load_code(source_file)

            if code is None:
                continue

            all_code += code + "\n\n"

            print("=" * 50)
            print(source_file.name)

            chunks = chunk_code(code)

            if (
                review_mode == "file"
                and source_file.name == selected_file
            ):
                selected_file_chunk_count = len(chunks)
                selected_file_code = code

            # Store embeddings
            for index, chunk in enumerate(chunks):

                print(f"\nChunk {index + 1}\n")
                print(chunk)

                metadata = {
                    "id": (
                        f"project_{project.id}_"
                        f"{source_file.name}_"
                        f"chunk_{index + 1}"
                    ),
                    "file_name": source_file.name,
                    "chunk_index": index + 1,
                    "project_id": project.id,
                }

                store_embedding(chunk, metadata)

        # Retrieve relevant chunks
        if review_mode == "file":

            documents = search_code(
                selected_file_code,
                project.id,
                file_name=selected_file,
                k=selected_file_chunk_count,
            )

        else:

            documents = search_code(
                all_code,
                project.id,
                k=10,
            )

        # Combine retrieved chunks
        retrieved_code = "\n\n".join(
            document.page_content
            for document in documents
        )

        # Measure complete LLM pipeline latency
        llm_start_time = perf_counter()

        # Generate AI review
        review_result = review_code(retrieved_code)
        review = review_result["review"]

        # Save review
        new_review = Review(
            project_id=project.id,
            review_text=review,
        )

        db.add(new_review)
        db.flush()

       # Evaluate review
        evaluation_result = evaluate_review(
            review_text=review,
            code_context=retrieved_code,
        )

        evaluation_scores = evaluation_result["scores"]

        # Complete LLM pipeline latency
        llm_latency = (perf_counter() - llm_start_time)
        # Total LLM cost: review generation + evaluation
        total_llm_cost = (review_result["cost"] + evaluation_result["cost"])

        print("\n========== LLM Usage ==========")

        print(f"Review input tokens: " f"{review_result['input_tokens']}")

        print(f"Review output tokens: "   f"{review_result['output_tokens']}")

        print(f"Evaluation input tokens: " f"{evaluation_result['input_tokens']}")

        print(f"Evaluation output tokens: " f"{evaluation_result['output_tokens']}")

        print(f"LLM latency: "   f"{llm_latency:.3f} seconds")

        print(f"LLM cost: "   f"${total_llm_cost:.8f}")

       # Save evaluation
        evaluation = Evaluation(review_id=new_review.id,

        correctness=evaluation_scores["correctness"],

        relevance=evaluation_scores["relevance"],

        completeness=evaluation_scores["completeness"],

        severity_accuracy=evaluation_scores["severity_accuracy"],

        groundedness=evaluation_scores["groundedness"],

        hallucination=evaluation_scores["hallucination"],

        latency=llm_latency,

        cost=total_llm_cost,)
     
        db.add(evaluation)


        # Mark project completed
        project.status = "completed"

        db.commit()
        db.refresh(new_review)

        print("\n========== AI Code Review ==========\n")
        print(review)

        return {
            "message": "Upload Successful",
            "project_id": project.id,
            "review_id": new_review.id,
            "review": review,
            "folder": str(extract_path),
            "files": [str(source_file) for source_file in files],
            "user_id": current_user.id,
            "user_email": current_user.email,
            "status": project.status,
        }

    except Exception as exc:

        project.status = "failed"
        db.commit()

        print("\n========== Upload Failed ==========")
        print(exc)
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=f"Project processing failed: {str(exc)}",
        )