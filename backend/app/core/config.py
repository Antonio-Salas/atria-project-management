from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Atria API"
    DEBUG: bool = False
    API_V1_PREFIX: str = "/api/v1"

    # Database
    DATABASE_URL: str  # Required

    # NextAuth — same secret as in the frontend
    NEXTAUTH_SECRET: str  # Required

    # Google Cloud Storage
    GCS_BUCKET_NAME: str = "atria-files"
    GCS_PROJECT_ID: str = ""

    # CORS — list of allowed origins
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    # Default limits (fallback if the user does not have an assigned plan)
    DEFAULT_MAX_PROJECTS: int = 5
    DEFAULT_MAX_COLLABORATORS: int = 3
    DEFAULT_MAX_STORAGE_MB: int = 500

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",  # Ignore extra vars in .env without error
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
