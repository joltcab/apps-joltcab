from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
import bcrypt
import jwt
import stripe
from models import (
    UserCreate, UserLogin, User, UserUpdate, TokenResponse,
    TripCreate, Trip, TripStatus, TripRating,
    WalletTransaction, WalletTopup, PaymentIntent, PaymentIntentResponse,
    DriverLocationUpdate, Location, PaymentMethod, PaymentStatus
)
import math

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET', 'joltcab-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Stripe Configuration
stripe.api_key = "sk_test_51K4e7jLM1u3hGW9xljZuHKdSV7RiEd4USOUkLG7nz9wHlbVLafE7VyGmoTcY326iiLVNtZnY7KFIGZeEeCDZgAaW00LfExBhfc"

# Create the main app
app = FastAPI(title="JoltCab API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Helper Functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = await db.users.find_one({"id": user_id})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def calculate_fare(distance_km: float) -> float:
    # Base fare + per km rate
    base_fare = 5.0
    per_km_rate = 2.5
    return round(base_fare + (distance_km * per_km_rate), 2)

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    # Haversine formula
    R = 6371  # Earth's radius in km
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    return round(R * c, 2)

# ==================== AUTH ENDPOINTS ====================

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_id = str(uuid.uuid4())
    hashed_password = hash_password(user_data.password)
    
    user_dict = {
        "id": user_id,
        "email": user_data.email,
        "password": hashed_password,
        "full_name": user_data.full_name,
        "phone": user_data.phone,
        "role": user_data.role,
        "profile_image": None,
        "wallet_balance": 0.0,
        "is_active": True,
        "created_at": datetime.utcnow()
    }
    
    await db.users.insert_one(user_dict)
    
    # Create token
    token = create_access_token({"sub": user_id})
    
    user_response = User(**{k: v for k, v in user_dict.items() if k != 'password'})
    
    return TokenResponse(access_token=token, token_type="bearer", user=user_response)

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": user['id']})
    user_response = User(**{k: v for k, v in user.items() if k != 'password'})
    
    return TokenResponse(access_token=token, token_type="bearer", user=user_response)

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: dict = Depends(get_current_user)):
    return User(**{k: v for k, v in current_user.items() if k != 'password'})

@api_router.put("/auth/profile", response_model=User)
async def update_profile(update_data: UserUpdate, current_user: dict = Depends(get_current_user)):
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    if update_dict:
        await db.users.update_one({"id": current_user['id']}, {"$set": update_dict})
        current_user.update(update_dict)
    
    return User(**{k: v for k, v in current_user.items() if k != 'password'})

# ==================== TRIP ENDPOINTS ====================

@api_router.post("/trips", response_model=Trip)
async def create_trip(trip_data: TripCreate, current_user: dict = Depends(get_current_user)):
    # Calculate distance and fare
    distance = calculate_distance(
        trip_data.pickup_location.latitude,
        trip_data.pickup_location.longitude,
        trip_data.dropoff_location.latitude,
        trip_data.dropoff_location.longitude
    )
    fare = calculate_fare(distance)
    
    trip_id = str(uuid.uuid4())
    trip_dict = {
        "id": trip_id,
        "user_id": current_user['id'],
        "driver_id": None,
        "pickup_location": trip_data.pickup_location.dict(),
        "dropoff_location": trip_data.dropoff_location.dict(),
        "status": TripStatus.REQUESTED,
        "payment_method": trip_data.payment_method,
        "fare": fare,
        "distance": distance,
        "duration": None,
        "rating": None,
        "review": None,
        "created_at": datetime.utcnow(),
        "started_at": None,
        "completed_at": None
    }
    
    await db.trips.insert_one(trip_dict)
    return Trip(**trip_dict)

@api_router.get("/trips", response_model=List[Trip])
async def get_trips(current_user: dict = Depends(get_current_user), status: Optional[str] = None):
    query = {"user_id": current_user['id']}
    if status:
        query["status"] = status
    
    trips = await db.trips.find(query).sort("created_at", -1).to_list(100)
    return [Trip(**trip) for trip in trips]

@api_router.get("/trips/{trip_id}", response_model=Trip)
async def get_trip(trip_id: str, current_user: dict = Depends(get_current_user)):
    trip = await db.trips.find_one({"id": trip_id, "user_id": current_user['id']})
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return Trip(**trip)

@api_router.post("/trips/{trip_id}/rate")
async def rate_trip(trip_id: str, rating_data: TripRating, current_user: dict = Depends(get_current_user)):
    trip = await db.trips.find_one({"id": trip_id, "user_id": current_user['id']})
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    if trip['status'] != TripStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Can only rate completed trips")
    
    await db.trips.update_one(
        {"id": trip_id},
        {"$set": {"rating": rating_data.rating, "review": rating_data.review}}
    )
    
    return {"message": "Rating submitted successfully"}

@api_router.post("/trips/{trip_id}/cancel")
async def cancel_trip(trip_id: str, current_user: dict = Depends(get_current_user)):
    trip = await db.trips.find_one({"id": trip_id, "user_id": current_user['id']})
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    if trip['status'] in [TripStatus.COMPLETED, TripStatus.CANCELLED]:
        raise HTTPException(status_code=400, detail="Cannot cancel this trip")
    
    await db.trips.update_one({"id": trip_id}, {"$set": {"status": TripStatus.CANCELLED}})
    return {"message": "Trip cancelled successfully"}

# ==================== WALLET ENDPOINTS ====================

@api_router.get("/wallet/balance")
async def get_wallet_balance(current_user: dict = Depends(get_current_user)):
    return {"balance": current_user.get('wallet_balance', 0.0)}

@api_router.get("/wallet/transactions", response_model=List[WalletTransaction])
async def get_wallet_transactions(current_user: dict = Depends(get_current_user)):
    transactions = await db.wallet_transactions.find(
        {"user_id": current_user['id']}
    ).sort("created_at", -1).to_list(100)
    return [WalletTransaction(**tx) for tx in transactions]

@api_router.post("/wallet/topup")
async def topup_wallet(topup_data: WalletTopup, current_user: dict = Depends(get_current_user)):
    try:
        # Create Stripe PaymentIntent
        intent = stripe.PaymentIntent.create(
            amount=int(topup_data.amount * 100),  # Convert to cents
            currency="usd",
            payment_method=topup_data.payment_method_id,
            confirm=True,
            automatic_payment_methods={"enabled": True, "allow_redirects": "never"}
        )
        
        if intent.status == "succeeded":
            # Update wallet balance
            new_balance = current_user.get('wallet_balance', 0.0) + topup_data.amount
            await db.users.update_one(
                {"id": current_user['id']},
                {"$set": {"wallet_balance": new_balance}}
            )
            
            # Record transaction
            tx_id = str(uuid.uuid4())
            transaction = {
                "id": tx_id,
                "user_id": current_user['id'],
                "amount": topup_data.amount,
                "type": "credit",
                "description": "Wallet top-up",
                "balance_after": new_balance,
                "created_at": datetime.utcnow()
            }
            await db.wallet_transactions.insert_one(transaction)
            
            return {"message": "Wallet topped up successfully", "new_balance": new_balance}
        else:
            raise HTTPException(status_code=400, detail="Payment failed")
    
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== PAYMENT ENDPOINTS ====================

@api_router.post("/payments/create-intent", response_model=PaymentIntentResponse)
async def create_payment_intent(payment_data: PaymentIntent, current_user: dict = Depends(get_current_user)):
    try:
        intent = stripe.PaymentIntent.create(
            amount=int(payment_data.amount * 100),
            currency=payment_data.currency,
            automatic_payment_methods={"enabled": True}
        )
        
        return PaymentIntentResponse(
            client_secret=intent.client_secret,
            amount=payment_data.amount
        )
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== MISC ENDPOINTS ====================

@api_router.get("/")
async def root():
    return {"message": "JoltCab API v1.0", "status": "running"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Include router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
