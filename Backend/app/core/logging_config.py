import logging
from logging.config import dictConfig

LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "()": "uvicorn.logging.DefaultFormatter",
            "fmt": "%(levelprefix)s %(asctime)s - %(message)s",
            "use_colors": True,
        },
    },
    "handlers": {
        "default": {
            "formatter": "default",
            "class": "logging.StreamHandler",
            "stream": "ext://sys.stderr",  # Print to console
        },
    },
    "loggers": {
        "default": {
            "handlers": ["default"],
            "level": "INFO", # Set the default log level to INFO
        },
    },
}

def setup_logging():
    """Applies the logging configuration."""
    dictConfig(LOGGING_CONFIG)

