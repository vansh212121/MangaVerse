from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core import security
from app.crud import user_crud
from app.db.session import get_session
from app.models.user_model import User
from app.schemas.token_schema import TokenData

# This URL must match the path to your login endpoint exactly
reusable_oauth2 = OAuth2PasswordBearer(tokenUrl="/api/v1/login")


async def get_current_user(
    token: str = Depends(reusable_oauth2), db: AsyncSession = Depends(get_session)
) -> User:
    """
    Dependency to get the current user from a JWT token.
    This is the only dependency needed for now.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = security.verify_token(token)
        token_data = TokenData(sub=payload.get("sub"))
        if token_data.sub is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = await user_crud.get_user_by_email(email=token_data.sub, db=db)
    if user is None:
        raise credentials_exception

    return user
