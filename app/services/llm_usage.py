from typing import Any


# Gemini 2.5 Flash standard pricing
# USD per 1 million tokens
INPUT_COST_PER_1M = 0.30
OUTPUT_COST_PER_1M = 2.50


def extract_usage(response: Any) -> dict:
    """
    Extract token usage from a LangChain AIMessage.

    Supports the usage_metadata format returned by
    recent LangChain Google Gemini integrations.
    """

    usage = getattr(response, "usage_metadata", None)

    if usage:
        input_tokens = usage.get("input_tokens", 0) or 0
        output_tokens = usage.get("output_tokens", 0) or 0
        total_tokens = usage.get("total_tokens", 0) or 0

        return {
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "total_tokens": total_tokens,
        }

    # Fallback for older response formats
    response_metadata = getattr(
        response,
        "response_metadata",
        {},
    )

    token_usage = response_metadata.get(
        "token_usage",
        {},
    )

    input_tokens = token_usage.get(
        "prompt_tokens",
        0,
    ) or 0

    output_tokens = token_usage.get(
        "completion_tokens",
        0,
    ) or 0

    total_tokens = token_usage.get(
        "total_tokens",
        input_tokens + output_tokens,
    ) or 0

    return {
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
        "total_tokens": total_tokens,
    }


def calculate_cost(
    input_tokens: int,
    output_tokens: int,
) -> float:

    input_cost = (
        input_tokens / 1_000_000
    ) * INPUT_COST_PER_1M

    output_cost = (
        output_tokens / 1_000_000
    ) * OUTPUT_COST_PER_1M

    return input_cost + output_cost