from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status, HTTPException

from sqlmodel.ext.asyncio.session import AsyncSession

# Correct the import path for the dependency
from app.utils.deps import get_current_user
from app.db.session import get_session
from app.models.user_model import User
from app.schemas.manga_schema import (
    MangaCreate,
    MangaRead,
    MangaUpdate,
    UserCollectionManga,
)
from app.services import manga_service

router = APIRouter()

# === Jikan Data Endpoints (Cached) ===


@router.get("/manga/details/{mal_id}", response_model=MangaRead)
async def get_manga_details(mal_id: int):
    details = await manga_service.get_manga_details_service(mal_id)
    if not details:
        raise HTTPException(status_code=404, detail="Manga not found")
    return details


@router.get("/manga/top/manga", response_model=List[MangaRead])
async def get_top_manga(filter: Optional[str] = None):
    manga_list_dicts = await manga_service.get_top_manga_service(filter=filter)
    return [MangaRead(**manga) for manga in manga_list_dicts]


@router.get("/manga/search", response_model=List[MangaRead])
async def search_manga(q: str = Query(..., min_length=3)):
    manga_list_dicts = await manga_service.search_manga_service(q)
    return [MangaRead(**manga) for manga in manga_list_dicts]


@router.get("/manga/recommended", response_model=List[MangaRead])
async def get_recommendations():
    manga_list_dicts = await manga_service.get_recommendations_service()
    return [MangaRead(**manga) for manga in manga_list_dicts]


@router.get("/manga/genre/{genre_id}", response_model=List[MangaRead])
async def get_manga_by_genre(genre_id: int):
    manga_list_dicts = await manga_service.get_manga_by_genre_service(genre_id=genre_id)
    return [MangaRead(**manga) for manga in manga_list_dicts]


@router.get("/manga/news")
async def get_combined_news():
    return await manga_service.get_combined_news_service()


@router.get("/manga/", response_model=dict)
async def get_paginated_manga(
    page: int = 1,
    limit: int = 25,
    genre: str | None = None,
):
    filters = {"genres": genre} if genre else {}
    return await manga_service.get_paginated_manga_service(page, limit, filters)


# === User Collection Endpoints (Protected) ===


@router.get("/manga/user/collection", response_model=List[UserCollectionManga])
async def get_user_collection(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
):
    """Get the current logged-in user's manga collection with full details."""
    return await manga_service.get_user_collection_service(
        current_user=current_user, db=db
    )


@router.post("/manga/collection", status_code=status.HTTP_201_CREATED)
async def add_manga_to_collection(
    manga_in: MangaCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
):
    return await manga_service.add_manga_to_collection_service(
        mal_id=manga_in.mal_id, current_user=current_user, db=db
    )


@router.put("/manga/collection/{mal_id}", response_model=MangaRead)
async def update_manga_status(
    mal_id: int,
    manga_update: MangaUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
):
    updated_link = await manga_service.update_manga_status_service(
        mal_id=mal_id, new_status=manga_update.status, current_user=current_user, db=db
    )

    manga_details = await manga_service.get_manga_details_service(mal_id)

    if manga_details:
        manga_details.status = updated_link.status

    return manga_details


@router.delete("/manga/collection/{mal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_manga_from_collection(
    mal_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
):
    await manga_service.remove_manga_from_collection_service(
        mal_id=mal_id, current_user=current_user, db=db
    )
    return
