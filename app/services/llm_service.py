from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GOOGLE_API_KEY")
)



def review_code(code: str):

    prompt = f"""
You are a Senior Software Engineer.

Review the following code.

Provide:
1. Bugs
2. Code Quality
3. Improvements

Code:
{code}
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return response.text

    except Exception as e:
        print(f"Gemini API error: {e}")
        raise RuntimeError(
            "The AI review service is temporarily unavailable. "
            "Please try again later."
        )