from fastapi import HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm
from app.crud import user_crud
from app.core import security
from app.schemas.user_schema import UserCreate


async def register_new_user(user_in: UserCreate, db: AsyncSession):
    existing_user = await user_crud.get_user_by_email(email=user_in.email, db=db)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists.",
        )

    hashed_password = security.get_password_hash(user_in.password)
    user_in.password = hashed_password
    
    new_user = await user_crud.create_user(db=db, user_in=user_in)
    
    return new_user

async def authenticate_user(form_data: OAuth2PasswordRequestForm, db: AsyncSession) -> dict:
    """Business logic to authenticate a user and create a token."""
    user = await user_crud.get_user_by_email(email=form_data.username, db=db)

    if not user or not security.verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = security.create_access_token(data={"sub": user.email})
    
    # Return the full token object to match the schema
    return {"access_token": access_token, "token_type": "bearer"}