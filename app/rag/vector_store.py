import chromadb

client = chromadb.PersistentClient(
    path="data/chroma"
)

collection = client.get_or_create_collection(
    name="code_embeddings"
)


def store_embedding(
    chunk: str,
    embedding: list[float],
    metadata: dict,
):
    collection.add(
        ids=[metadata["id"]],
        embeddings=[embedding],
        documents=[chunk],
        metadatas=[metadata],
    )