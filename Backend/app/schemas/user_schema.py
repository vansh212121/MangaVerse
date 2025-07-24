from pydantic import BaseModel, EmailStr

# Base schema with common fields
class UserBase(BaseModel):
    name: str
    email: EmailStr

# Schema for creating a user
class UserCreate(UserBase):
    password: str

# Schema for reading a user (inherits from UserBase)
class UserRead(UserBase):
    id: int

    class Config:
        from_attributes = True