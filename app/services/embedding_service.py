from langchain_huggingface import HuggingFaceEmbeddings


embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


def generate_embedding(text: str) -> list[float]:
    return embedding_model.embed_query(text)