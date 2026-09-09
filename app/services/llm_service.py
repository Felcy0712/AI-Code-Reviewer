import os

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate


load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0,
    google_api_key=os.getenv("GOOGLE_API_KEY"),
)


prompt = ChatPromptTemplate.from_template(
    """
You are a Senior Software Engineer.

Review the following code.

Provide:
1. Bugs
2. Code Quality
3. Improvements

Code:
{code}
"""
)


def review_code(code: str) -> str:
    chain = prompt | llm

    try:
        response = chain.invoke({"code": code})
        return response.content

    except Exception as e:
        print(f"Gemini API error: {e}")
        raise RuntimeError(
            "The AI review service is temporarily unavailable. "
            "Please try again later."
        )