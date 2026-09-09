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
):
    retriever = vector_store.as_retriever(
        search_kwargs={
            "k": 10,
            "filter": {
                "project_id": project_id
            },
        }
    )

    return retriever.invoke(query)