import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import func
from sqlmodel import Column, Field, SQLModel, Relationship

if TYPE_CHECKING:
    from app.models.manga_model import UserMangaLink


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    email: str = Field(unique=True, index=True)
    password: str

    created_at: datetime.datetime = Field(
        default=None, sa_column=Column(nullable=False, server_default=func.now())
    )

    manga_links: List["UserMangaLink"] = Relationship(back_populates="user")
