from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models.user_model import User
from app.schemas.user_schema import UserCreate


async def get_user_by_email(email: str, db: AsyncSession) -> User | None:
    statement = select(User).where(User.email == email)
    result = await db.execute(statement)

    return result.scalar_one_or_none()


async def create_user(user_in: UserCreate, db: AsyncSession) -> User:
    new_user = User(name=user_in.name, email=user_in.email, password=user_in.password)
    db.add(new_user)
    await db.commit()
    db.refresh(new_user)

    return new_user


async def get_user_by_id(user_id: int, db: AsyncSession) -> User | None:
    """Fetches a single user by their ID."""
    statement = select(User).where(User.id == user_id)
    result = await db.execute(statement) 
    return result.scalar_one_or_none()  
