import os

from dotenv import load_dotenv

from langchain_google_genai import (
    ChatGoogleGenerativeAI,
)

from langchain_core.prompts import (
    ChatPromptTemplate,
)

from app.services.llm_usage import (
    extract_usage,
    calculate_cost,
)


load_dotenv()


llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0,
    google_api_key=os.getenv(
        "GOOGLE_API_KEY"
    ),
)


prompt = ChatPromptTemplate.from_template(
    """
You are a Senior Software Engineer.

Review the following code.

Provide:
1. Bugs
2. Code Quality
3. Improvements

Focus only on issues that are actually supported
by the provided code.

Do not invent hypothetical problems.

Keep the review proportional to the complexity
of the code.

Code:
{code}
"""
)


def review_code(code: str) -> dict:

    chain = prompt | llm

    try:

        response = chain.invoke(
            {
                "code": code
            }
        )

        usage = extract_usage(response)

        cost = calculate_cost(
            input_tokens=usage["input_tokens"],
            output_tokens=usage["output_tokens"],
        )

        return {
            "review": response.content,
            "input_tokens": usage["input_tokens"],
            "output_tokens": usage["output_tokens"],
            "total_tokens": usage["total_tokens"],
            "cost": cost,
        }

    except Exception as e:

        print(
            f"Gemini API error: {e}"
        )

        raise RuntimeError(
            "The AI review service is temporarily unavailable. "
            "Please try again later."
        )