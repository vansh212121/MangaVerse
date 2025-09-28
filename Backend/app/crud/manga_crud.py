# app/crud/manga_crud.py
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from app.models.manga_model import Manga, UserMangaLink, MangaStatus
from sqlalchemy.orm import selectinload

# === Operations on the main Manga table ===


async def get_or_create_manga(mal_id: int, db: AsyncSession) -> Manga:
    """
    Get a manga by mal_id, or create it if it doesn't exist.
    This prevents duplicate entries in our public 'manga' table.
    """
    statement = select(Manga).where(Manga.mal_id == mal_id)
    result = await db.execute(statement)
    db_manga = result.scalar_one_or_none()

    if not db_manga:
        db_manga = Manga(mal_id=mal_id)
        db.add(db_manga)
        await db.commit()
        await db.refresh(db_manga)

    return db_manga


# === Operations on the UserMangaLink table ===
async def get_user_manga_link(
    user_id: int, manga_id: int, db: AsyncSession
) -> UserMangaLink | None:
    """Check if a specific user has a specific manga in their collection."""
    statement = select(UserMangaLink).where(
        UserMangaLink.user_id == user_id, UserMangaLink.manga_id == manga_id
    )
    result = await db.execute(statement)
    return result.scalar_one_or_none()


async def add_manga_to_user_collection(
    user_id: int, manga_id: int, db: AsyncSession
) -> UserMangaLink:
    """Add a manga to a user's collection by creating a link."""
    db_link = UserMangaLink(user_id=user_id, manga_id=manga_id)
    db.add(db_link)
    await db.commit()
    await db.refresh(db_link)
    return db_link


async def remove_manga_from_user_collection(link: UserMangaLink, db: AsyncSession):
    """Remove a manga from a user's collection by deleting the link."""
    await db.delete(link)
    await db.commit()
    return


async def update_user_manga_status(
    link: UserMangaLink, status: MangaStatus, db: AsyncSession
) -> UserMangaLink:
    """Update the reading status for a manga in a user's collection."""
    link.status = status
    db.add(link)
    await db.commit()
    await db.refresh(link)
    return link


async def get_user_collection_links(
    user_id: int, db: AsyncSession
) -> list[UserMangaLink]:
    """Efficiently gets a user's collection with related manga info."""
    statement = (
        select(UserMangaLink)
        .where(UserMangaLink.user_id == user_id)
        .options(selectinload(UserMangaLink.manga))
    )
    result = await db.execute(statement)
    return result.scalars().all()
