import chromadb

from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings


embedding_function = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

client = chromadb.PersistentClient(
    path="data/chroma"
)

vector_store = Chroma(
    client=client,
    collection_name="code_embeddings",
    embedding_function=embedding_function,
)


def store_embedding(
    chunk: str,
    metadata: dict,
):
    vector_store.add_texts(
        texts=[chunk],
        metadatas=[metadata],
        ids=[metadata["id"]],
    )