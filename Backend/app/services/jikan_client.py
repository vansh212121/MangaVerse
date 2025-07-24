import asyncio
import httpx

JIKAN_API_BASE_URL = "https://api.jikan.moe/v4"
POPULAR_MANGA_IDS_FOR_NEWS = [2, 1706, 1, 11, 16498]

# Create a semaphore to allow 3 concurrent requests to Jikan
jikan_semaphore = asyncio.Semaphore(3)

async def _make_request(endpoint: str, params: dict = None) -> dict:
    """A reusable, rate-limited function to make requests to the Jikan API."""
    async with jikan_semaphore: # This will wait if 3 tasks are already running
        # Jikan also asks for a small delay between requests
        await asyncio.sleep(0.4)
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{JIKAN_API_BASE_URL}/{endpoint}",
                    params=params,
                    timeout=20.0 # Add a timeout
                )
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                print(f"Jikan API Error: {e}")
                return {}

async def get_manga_details(mal_id: int) -> dict | None:
    """Fetches detailed information for a single manga."""
    data = await _make_request(f"manga/{mal_id}")
    return data.get("data")

async def search_manga(query: str, limit: int = 10) -> list:
    """Searches for manga by a query string."""
    data = await _make_request("manga", params={"q": query, "limit": limit})
    return data.get("data", [])

async def get_top_manga(filter: str | None = None) -> list:
    """Fetches top manga. Can be filtered by 'favorite' or 'upcoming'."""
    params = {"filter": filter} if filter else {}
    data = await _make_request("top/manga", params=params)
    return data.get("data", [])

async def get_manga_by_genre(genre_id: int, limit: int = 12) -> list:
    """Fetches manga by a specific genre ID."""
    params = {"genres": str(genre_id), "limit": limit, "order_by": "popularity"}
    data = await _make_request("manga", params=params)
    return data.get("data", [])

async def get_paginated_manga_list(page: int, limit: int, filters: dict) -> dict:
    """Fetches a paginated list of manga with optional filters."""
    params = {"page": page, "limit": limit}
    if filters:
        params.update(filters)
    return await _make_request("manga", params=params)

async def get_manga_news(mal_id: int) -> list:
    """Helper function to get news for a single manga ID."""
    data = await _make_request(f"manga/{mal_id}/news")
    return data.get("data", [])

async def get_combined_news_for_popular() -> list:
    """Fetches news for popular manga concurrently AND safely."""
    tasks = [get_manga_news(mal_id) for mal_id in POPULAR_MANGA_IDS_FOR_NEWS]
    results = await asyncio.gather(*tasks)
    all_news = [item for sublist in results for item in sublist]
    all_news.sort(key=lambda x: x.get("date", ""), reverse=True)
    return all_news

async def get_recommendations() -> list:
    """Fetches manga recommendations concurrently AND safely."""
    data = await _make_request("recommendations/manga")
    recommendation_entries = data.get("data", [])[:12]

    tasks = []
    for entry in recommendation_entries:
        if entry.get("entry"):
            mal_id = entry["entry"][0]["mal_id"]
            tasks.append(get_manga_details(mal_id))

    results = await asyncio.gather(*tasks)
    return [manga for manga in results if manga]