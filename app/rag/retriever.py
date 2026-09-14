from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings


embedding_function = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

vector_store = Chroma(
    collection_name="code_embeddings",
    persist_directory="data/chroma",
    embedding_function=embedding_function,
)


def search_code(
    query: str,
    project_id: int,
    file_name: str | None = None,
    k: int = 10,
):
    if file_name:
        metadata_filter = {
            "$and": [
                {"project_id": project_id},
                {"file_name": file_name},
            ]
        }
    else:
        metadata_filter = {
            "project_id": project_id
        }

    retriever = vector_store.as_retriever(
        search_kwargs={
            "k": k,
            "filter": metadata_filter,
        }
    )

    return retriever.invoke(query)