# app/schemas/manga_schema.py

from pydantic import BaseModel
from app.models.manga_model import MangaStatus

# Schema for adding a manga to a user's collection.
# The user only needs to provide the MyAnimeList ID.
class MangaCreate(BaseModel):
    mal_id: int

# Schema for updating a manga in the user's collection.
class MangaUpdate(BaseModel):
    status: MangaStatus

# This will be the standard representation of a manga in our API responses.
# It's not a database model; it's a flexible shape for the data we get
# from Jikan and combine with our own DB status.
class MangaRead(BaseModel):
    mal_id: int
    title: str
    
    # FIX: Change this from MangaStatus to a simple string
    # This allows it to accept 'Finished', 'Publishing', etc., from the Jikan API.
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

