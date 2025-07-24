from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession

from app.utils.deps import get_current_user
from app.crud import user_crud
from app.db.session import get_session
from app.models.user_model import User
from app.schemas.user_schema import UserRead

router = APIRouter(
    tags=["User"]
)


@router.get("/user/me", response_model=UserRead)
def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Get the current logged-in user.
    """
    return current_user


@router.get("/user/{user_id}", response_model=UserRead)
async def read_user_by_id(
    user_id: int,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific user by their ID.
    """
    user = await user_crud.get_user_by_id(user_id=user_id, db=db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found."
        )
    return user