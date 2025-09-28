# app/api/v1/endpoints/user.py
from fastapi import APIRouter, Depends, status
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm
from app.db.session import get_session
from app.schemas.user_schema import UserCreate, UserRead
from app.services import user_service
from app.schemas.token_schema import Token
from app.utils.deps import get_current_user
from app.models.user_model import User


router = APIRouter(tags=["AUTHENTICATION"])


@router.post("/signup", status_code=status.HTTP_201_CREATED, response_model=UserRead)
async def signup_new_user(user_in: UserCreate, db: AsyncSession = Depends(get_session)):
    """Endpoint to handle new user registration."""
    return await user_service.register_new_user(user_in=user_in, db=db)


@router.post("/login", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_session),
):
    """Endpoint to handle user login and token generation."""
    # The endpoint is now just a clean pass-through to the service layer
    return await user_service.authenticate_user(form_data=form_data, db=db)


@router.get("/me", response_model=UserRead)
def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Get the current logged-in user.
    """
    return current_user
