from pydantic import BaseModel
from typing import Optional

# ---- User Schemas ----

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True


# ---- Transaction Schemas ----

class TransactionCreate(BaseModel):
    type: str           # "income" or "expense"
    amount: float
    category: str
    note: Optional[str] = None
    date: str

class TransactionUpdate(BaseModel):
    type: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[str] = None
    note: Optional[str] = None
    date: Optional[str] = None

class TransactionResponse(BaseModel):
    id: int
    type: str
    amount: float
    category: str
    note: Optional[str] = None
    date: str
    user_id: int

    class Config:
        from_attributes = True


# ---- Token Schema ----

class Token(BaseModel):
    access_token: str
    token_type: str