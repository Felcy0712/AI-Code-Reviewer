#It handles an HTTP request:POST /upload
from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from pathlib import Path

from app.dependencies.auth import get_current_user
from app.models.user import User
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.project import Project

from app.services.file_service import extract_zip
from app.services.code_reader import read_source_files
from app.services.code_loader import load_code
from app.services.chunker import chunk_code

from app.rag.vector_store import store_embedding
from app.rag.retriever import search_code
from app.services.llm_service import review_code
from app.models.review import Review

router = APIRouter()

UPLOAD_DIR = Path("data/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/upload")
async def upload_project(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Create project record first
    project = Project(
        user_id=current_user.id,
        name=Path(file.filename).stem,
        filename=file.filename,
        status="processing",
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    #Error handling for file upload and processing.
    try:
        # function body starts here
        file_path = UPLOAD_DIR / file.filename

        # Save uploaded ZIP
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        # Extract ZIP
        extract_path = extract_zip(file_path)

        # Find source files
        files = read_source_files(extract_path)

        # Store all project code together
        all_code = ""

        # Process each source file
        for source_file in files:

            code = load_code(source_file)

            # Add file content to project-level code
            all_code += code + "\n\n"

            print("=" * 50)
            print(source_file.name)

            # Split code into chunks
            chunks = chunk_code(code)

            # Generate embeddings and store in ChromaDB
            for index, chunk in enumerate(chunks):

                print(f"\nChunk {index + 1}\n")
                print(chunk)

                # embedding = generate_embedding(chunk)
                # print(f"Embedding Dimension: {len(embedding)}")

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

        # Retrieve relevant chunks using the whole project
        documents = search_code(all_code, project.id)

        # Combine retrieved chunks into one context
        retrieved_code = "\n\n".join(
            document.page_content for document in documents
        )

        # Send combined context to Gemini
        review = review_code(retrieved_code)

        # Send the review to the db via sqlalchemy.
        new_review = Review(
            project_id=project.id,
            review_text=review,
        )
        db.add(new_review)
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
        # Mark project as failed
        project.status = "failed"
        db.commit()

        print(
            f"\n========== Upload Failed ==========\n{exc}"
        )

        raise HTTPException(
            status_code=500,
            detail=f"Project processing failed: {str(exc)}",
        )