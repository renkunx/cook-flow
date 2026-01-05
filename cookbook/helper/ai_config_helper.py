"""
Helper functions for AI provider configuration with environment variable support.
"""
import os
from typing import Optional
from cookbook.models import AiProvider


def get_ai_provider_config(ai_provider: AiProvider) -> dict:
    """
    Get AI provider configuration with environment variable support.

    API key, model name, and URL can reference environment variables using the format:
    - ENV:VARIABLE_NAME
    - env://VARIABLE_NAME
    - ${VARIABLE_NAME}
    - Plain text (fallback)

    Args:
        ai_provider: AiProvider instance

    Returns:
        dict with 'api_key', 'model', and 'api_base' (if url is set)
    """
    config = {
        'api_key': _resolve_env_var(ai_provider.api_key),
        'model': _resolve_env_var(ai_provider.model_name),
    }

    if ai_provider.url:
        config['api_base'] = _resolve_env_var(ai_provider.url)

    return config


def _resolve_env_var(value: Optional[str]) -> Optional[str]:
    """
    Resolve environment variable references in the given value.

    Supported formats:
    - ENV:VARIABLE_NAME
    - env://VARIABLE_NAME
    - ${VARIABLE_NAME}
    - Plain text (returned as-is)

    Args:
        value: String value that may contain an environment variable reference

    Returns:
        Resolved value or original value if no reference found
    """
    if not value:
        return None

    value = value.strip()

    # Format: ENV:VARIABLE_NAME or env://VARIABLE_NAME
    if value.startswith('ENV:'):
        env_var = value[4:].strip()
        return os.getenv(env_var, value)
    elif value.startswith('env://'):
        env_var = value[6:].strip()
        return os.getenv(env_var, value)
    # Format: ${VARIABLE_NAME}
    elif value.startswith('${') and value.endswith('}'):
        env_var = value[2:-1].strip()
        return os.getenv(env_var, value)

    # Return plain text as-is
    return value
