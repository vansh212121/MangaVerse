import asyncio
import json
from redis import asyncio as aioredis
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import HTTPException, status

from app.core.config import settings
from app.crud import manga_crud
from app.services import jikan_client
from app.models.user_model import User
from app.models.manga_model import MangaStatus, Manga
from app.schemas.manga_schema import MangaRead, UserCollectionManga

# Initialize the Redis client
redis = aioredis.from_url(str(settings.REDIS_URL), decode_responses=True)
CACHE_EXPIRATION_SECONDS = 60 * 60 * 24  # 24 hours

# In app/services/manga_service.py

def _map_jikan_to_manga_read(jikan_data: dict) -> MangaRead | None:
    """Safely maps a raw Jikan API response to our MangaRead schema."""
    if not jikan_data:
        return None

    author_list = jikan_data.get("authors", [])
    author = author_list[0].get("name") if author_list else "Unknown"

    published_from = jikan_data.get("published", {}).get("from")
    year = str(published_from).split("-")[0] if published_from else "N/A"
    
    tags = [g["name"] for g in jikan_data.get("genres", [])]
    
    # Use .get() for alternative titles to handle cases where they might be null
    alternative_title = jikan_data.get("title_english") or jikan_data.get("title_japanese")

    return MangaRead(
        mal_id=jikan_data.get("mal_id"),
        title=jikan_data.get("title"),
        status=jikan_data.get("status"),
        cover_url=jikan_data.get("images", {}).get("jpg", {}).get("image_url"),
        author=author,
        year=year,
        rating=jikan_data.get("score"),
        tags=tags,
        # ADD THESE TWO MAPPINGS:
        description=jikan_data.get("synopsis"),
        alternative_title=alternative_title
    )


# --- Caching Jikan Data Services (All now use the mapper) ---

async def get_manga_details_service(mal_id: int) -> MangaRead | None:
    cache_key = f"manga_details:{mal_id}"
    if cached_data := await redis.get(cache_key):
        return MangaRead(**json.loads(cached_data))
    if not (jikan_data := await jikan_client.get_manga_details(mal_id)):
        return None
    mapped_manga = _map_jikan_to_manga_read(jikan_data)
    await redis.set(cache_key, mapped_manga.model_dump_json(), ex=CACHE_EXPIRATION_SECONDS)
    return mapped_manga

async def get_top_manga_service(filter: str | None = None) -> list[MangaRead]:
    cache_key = f"top_manga:{filter or 'popular'}"
    if cached_data := await redis.get(cache_key):
        return json.loads(cached_data)
    
    jikan_list = await jikan_client.get_top_manga(filter=filter)
    mapped_list = [_map_jikan_to_manga_read(item) for item in jikan_list if item]
    
    # Cache for 2 hours instead of default
    await redis.set(cache_key, json.dumps([m.model_dump() for m in mapped_list]), ex=7200)
    return [m.model_dump() for m in mapped_list]

async def search_manga_service(query: str) -> list[dict]:
    cache_key = f"search:{query.lower().replace(' ', '_')}"
    if cached_data := await redis.get(cache_key):
        return json.loads(cached_data)
    jikan_list = await jikan_client.search_manga(query)
    mapped_list = [_map_jikan_to_manga_read(item) for item in jikan_list if item]
    await redis.set(cache_key, json.dumps([m.model_dump() for m in mapped_list]), ex=3600)
    return [m.model_dump() for m in mapped_list]

async def get_recommendations_service() -> list[dict]:
    cache_key = "manga_recommendations"
    if cached_data := await redis.get(cache_key):
        return json.loads(cached_data)
    jikan_list = await jikan_client.get_recommendations()
    mapped_list = [_map_jikan_to_manga_read(item) for item in jikan_list if item]
    await redis.set(cache_key, json.dumps([m.model_dump() for m in mapped_list]), ex=CACHE_EXPIRATION_SECONDS)
    return [m.model_dump() for m in mapped_list]

async def get_manga_by_genre_service(genre_id: int) -> list[dict]:
    cache_key = f"genre:{genre_id}"
    if cached_data := await redis.get(cache_key):
        return json.loads(cached_data)
    jikan_list = await jikan_client.get_manga_by_genre(genre_id)
    mapped_list = [_map_jikan_to_manga_read(item) for item in jikan_list if item]
    await redis.set(cache_key, json.dumps([m.model_dump() for m in mapped_list]), ex=CACHE_EXPIRATION_SECONDS)
    return [m.model_dump() for m in mapped_list]

async def get_combined_news_service() -> list:
    # This service is fine as it doesn't use the MangaRead mapper
    cache_key = "combined_news"
    if cached_data := await redis.get(cache_key):
        return json.loads(cached_data)
    news_list = await jikan_client.get_combined_news_for_popular()
    await redis.set(cache_key, json.dumps(news_list), ex=3600 * 6)
    return news_list

async def get_paginated_manga_service(page: int, limit: int, filters: dict) -> dict:
    """Service to get a paginated list of manga, with caching."""
    # Create a unique key based on all parameters
    filter_str = "_".join(f"{k}_{v}" for k, v in sorted(filters.items()))
    cache_key = f"manga_list:p{page}:l{limit}:{filter_str}"
    
    if cached_data := await redis.get(cache_key):
        return json.loads(cached_data)

    jikan_response = await jikan_client.get_paginated_manga_list(page, limit, filters)
    
    # Map the manga list within the response
    raw_manga_list = jikan_response.get("data", [])
    mapped_manga_list = [_map_jikan_to_manga_read(item) for item in raw_manga_list if item]
    
    # Reconstruct the response with the mapped data
    final_response = {
        "mangas": [m.model_dump() for m in mapped_manga_list],
        "pagination": jikan_response.get("pagination")
    }

    await redis.set(cache_key, json.dumps(final_response), ex=3600) # Cache for 1 hour
    return final_response


# --- User Collection Services ---

async def add_manga_to_collection_service(mal_id: int, current_user: User, db: AsyncSession):
    manga = await manga_crud.get_or_create_manga(mal_id=mal_id, db=db)
    if await manga_crud.get_user_manga_link(user_id=current_user.id, manga_id=manga.id, db=db):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Manga already in collection.")
    await manga_crud.add_manga_to_user_collection(user_id=current_user.id, manga_id=manga.id, db=db)
    return {"message": "Manga successfully added to your collection."}

async def update_manga_status_service(mal_id: int, new_status: MangaStatus, current_user: User, db: AsyncSession):
    manga = await manga_crud.get_or_create_manga(mal_id=mal_id, db=db)
    link = await manga_crud.get_user_manga_link(user_id=current_user.id, manga_id=manga.id, db=db)
    if not link:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Manga not in collection.")
    return await manga_crud.update_user_manga_status(link=link, status=new_status, db=db)

async def remove_manga_from_collection_service(mal_id: int, current_user: User, db: AsyncSession):
    manga = await manga_crud.get_or_create_manga(mal_id=mal_id, db=db)
    link = await manga_crud.get_user_manga_link(user_id=current_user.id, manga_id=manga.id, db=db)
    if not link:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Manga not in collection.")
    await manga_crud.remove_manga_from_user_collection(link=link, db=db)
    return {"message": "Manga successfully removed from your collection."}

async def get_user_collection_service(current_user: User, db: AsyncSession) -> list[UserCollectionManga]:
    """
    Gets a user's collection, enriches it with Jikan data, and returns it.
    """
    # 1. Get the user's saved manga list from our database.
    # This is fast and efficient because it uses a single query.
    collection_links = await manga_crud.get_user_collection_links(
        user_id=current_user.id, db=db
    )
    if not collection_links:
        return []

    # 2. Create a list of tasks to fetch full details for each manga concurrently.
    tasks = [
        get_manga_details_service(link.manga.mal_id)
        for link in collection_links if link.manga
    ]
    all_manga_details = await asyncio.gather(*tasks)

    # 3. Create a dictionary of the fetched details for fast lookups.
    details_map = {m.mal_id: m for m in all_manga_details if m}

    # 4. Build the final, combined list.
    final_collection = []
    for link in collection_links:
        # Find the matching details from our map.
        if link.manga and link.manga.mal_id in details_map:
            details = details_map[link.manga.mal_id]
            
            # Create the final object using the correct schema.
            user_manga = UserCollectionManga(
                mal_id=details.mal_id,
                title=details.title,
                status=link.status,  # Use the status from OUR database
                cover_url=details.cover_url,
                author=details.author,
                year=details.year,
                rating=details.rating,
                tags=details.tags
            )
            final_collection.append(user_manga)
            
    return final_collection