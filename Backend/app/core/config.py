from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

env_path = Path(".") / ".env"


class Settings(BaseSettings):
    # Your settings like DATABASE_URL and SECRET_KEY
    DATABASE_URL: str
    SECRET_KEY: str
    REDIS_URL : str
    
    # Other settings...
    PROJECT_NAME: str = "Manga Verse API"
    API_V1_STR: str = "/api/v1"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    model_config = SettingsConfigDict(
        env_file=env_path, 
        case_sensitive=True,
        extra='ignore'
    )


settings = Settings()