import datetime
import enum
from typing import Optional, List, TYPE_CHECKING
from sqlmodel import Column, Enum, Field, SQLModel, func, Relationship

if TYPE_CHECKING:
    from app.models.user_model import User

# -----------------
# 1. The Enum for the status
# -----------------
class MangaStatus(str, enum.Enum):
    """Enum for the user's reading status of a manga."""
    READING = "reading"
    COMPLETED = "completed"
    PLANNED = "planned"

# -----------------
# 2. The Link Table (where the status lives)
# -----------------
class UserMangaLink(SQLModel, table=True):
    """
    Connects a User to a Manga and stores the user's status.
    """
    user_id: int = Field(foreign_key="user.id", primary_key=True)
    manga_id: int = Field(foreign_key="manga.id", primary_key=True)

    # --- CORRECTED FIELDS ---

    # For the status, 'nullable=False' must go inside the Column
    status: MangaStatus = Field(
        default=MangaStatus.PLANNED,
        sa_column=Column(Enum(MangaStatus), nullable=False)
    )

    # For added_at, both 'nullable' and 'server_default' go inside the Column
    added_at: datetime.datetime = Field(
        default=None,
        sa_column=Column(nullable=False, server_default=func.now())
    )
    
    manga: Optional["Manga"] = Relationship(back_populates="user_links")
    user: "User" = Relationship(back_populates="manga_links")
# -----------------
# 3. The lean Manga Table (for reference)
# -----------------
class Manga(SQLModel, table=True):

    id: Optional[int] = Field(default=None, primary_key=True)
    mal_id: int = Field(unique=True, index=True)
    
    user_links: List["UserMangaLink"] = Relationship(back_populates="manga")