# Make sure these imports are at the top of your file
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

    # --- CORRECTED created_at FIELD ---
    created_at: datetime.datetime = Field(
        default=None,
        # Just like in the other model, server_default must go inside sa_column
        sa_column=Column(nullable=False, server_default=func.now())
    )
    
    manga_links: List["UserMangaLink"] = Relationship(back_populates="user")