import json

from app.services.llm_service import llm
from app.services.llm_usage import (
    extract_usage,
    calculate_cost,
)


def evaluate_review(
    review_text: str,
    code_context: str,
) -> dict:

    prompt = f"""
You are an AI code-review evaluator.

Evaluate the AI-generated review against the
actual source code.

CODE:
{code_context}

AI REVIEW:
{review_text}

Score each metric from 0 to 1.

Definitions:

correctness:
Are the identified issues technically correct?

relevance:
Are the review comments relevant to the provided code?

completeness:
Did the review identify important issues that
should reasonably have been identified?

severity_accuracy:
Are the stated severity levels appropriate?

groundedness:
Are the review claims supported by the provided
code?

hallucination:
Does the review contain unsupported claims,
invented issues, or facts not present in the code?

Important:

For hallucination:
0.0 = no hallucination
1.0 = severe hallucination

Return ONLY valid JSON.

Format:

{{
    "correctness": 0.0,
    "relevance": 0.0,
    "completeness": 0.0,
    "severity_accuracy": 0.0,
    "groundedness": 0.0,
    "hallucination": 0.0
}}
"""

    try:

        response = llm.invoke(prompt)

        usage = extract_usage(response)

        cost = calculate_cost(
            input_tokens=usage["input_tokens"],
            output_tokens=usage["output_tokens"],
        )

        content = response.content.strip()

        # Remove Markdown JSON fences if Gemini returns them
        if content.startswith("```"):
            content = content.replace(
                "```json",
                "",
                1,
            )

            content = content.replace(
                "```",
                "",
            )

            content = content.strip()

        scores = json.loads(content)

        return {
            "scores": scores,
            "input_tokens": usage["input_tokens"],
            "output_tokens": usage["output_tokens"],
            "total_tokens": usage["total_tokens"],
            "cost": cost,
        }

    except Exception as e:

        print(
            f"Evaluation error: {e}"
        )

        raise RuntimeError(
            "LLM evaluation failed."
        )