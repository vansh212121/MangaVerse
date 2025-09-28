# app/schemas/manga_schema.py

from pydantic import BaseModel
from app.models.manga_model import MangaStatus


# Schema for adding a manga to a user's collection.
class MangaCreate(BaseModel):
    mal_id: int


# Schema for updating a manga in the user's collection.
class MangaUpdate(BaseModel):
    status: MangaStatus


class MangaRead(BaseModel):
    mal_id: int
    title: str
    status: str | None = None
    cover_url: str | None = None
    author: str | None = None
    year: int | str | None = None
    rating: float | None = None
    tags: list[str] = []

    description: str | None = None
    alternative_title: str | None = None


class UserCollectionManga(BaseModel):
    mal_id: int
    title: str
    status: MangaStatus
    cover_url: str | None = None
    author: str | None = None
    year: int | str | None = None
    rating: float | None = None
    tags: list[str] = []

    description: str | None = None
    alternative_title: str | None = None

    class Config:
        from_attributes = True
