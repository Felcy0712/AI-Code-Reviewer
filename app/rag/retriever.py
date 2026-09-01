import chromadb

from app.services.embedding_service import generate_embedding


client = chromadb.PersistentClient(
    path="data/chroma"
)

collection = client.get_or_create_collection(
    name="code_embeddings"
)


def search_code(
    query: str,
    project_id: int,
):
    query_embedding = generate_embedding(query)

    return collection.query(
        query_embeddings=[query_embedding],
        n_results=10,
        where={
            "project_id": project_id
        },
    )