from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    USER = "user"
    DRIVER = "driver"
    ADMIN = "admin"

class TripStatus(str, Enum):
    REQUESTED = "requested"
    ACCEPTED = "accepted"
    STARTED = "started"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class PaymentMethod(str, Enum):
    CASH = "cash"
    CARD = "card"
    WALLET = "wallet"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

# User Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: str
    role: UserRole = UserRole.USER

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    phone: str
    role: UserRole
    profile_image: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    wallet_balance: float = 0.0
    is_active: bool = True

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    profile_image: Optional[str] = None

# Location Models
class Location(BaseModel):
    latitude: float
    longitude: float
    address: str

# Trip Models
class TripCreate(BaseModel):
    pickup_location: Location
    dropoff_location: Location
    payment_method: PaymentMethod

class Trip(BaseModel):
    id: str
    user_id: str
    driver_id: Optional[str] = None
    pickup_location: Location
    dropoff_location: Location
    status: TripStatus
    payment_method: PaymentMethod
    fare: float
    distance: float  # in km
    duration: Optional[int] = None  # in minutes
    rating: Optional[float] = None
    review: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

class TripRating(BaseModel):
    trip_id: str
    rating: float = Field(..., ge=1, le=5)
    review: Optional[str] = None

# Wallet Models
class WalletTransaction(BaseModel):
    id: str
    user_id: str
    amount: float
    type: str  # credit, debit
    description: str
    balance_after: float
    created_at: datetime = Field(default_factory=datetime.utcnow)

class WalletTopup(BaseModel):
    amount: float = Field(..., gt=0)
    payment_method_id: str  # Stripe payment method ID

# Payment Models
class PaymentIntent(BaseModel):
    amount: float
    currency: str = "usd"

class PaymentIntentResponse(BaseModel):
    client_secret: str
    amount: float

# Driver Location Update
class DriverLocationUpdate(BaseModel):
    latitude: float
    longitude: float

# Token Response
class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: User
