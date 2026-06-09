from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    supabase_url:         str = ""
    supabase_key:         str = ""
    supabase_service_key: str = ""
    environment:          str = "development"
    allowed_origins:      str = "http://localhost:3000,http://localhost:5173"

    @property
    def origins_list(self) -> list[str]:
        return self.allowed_origins.split(",")

    class Config:
        env_file = ".env"

@lru_cache
def get_settings() -> Settings:
    return Settings()