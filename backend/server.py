from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
from jose import JWTError, jwt
from passlib.context import CryptContext
import shutil

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT settings
SECRET_KEY = os.environ.get('JWT_SECRET', 'archipelago-scent-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ========== MODELS ==========

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: EmailStr
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class AromaNotes(BaseModel):
    top: List[str]
    heart: List[str]
    base: List[str]

class Island(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    story: str
    mood: str
    aroma_notes: AromaNotes
    image_url: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class IslandUpdate(BaseModel):
    name: Optional[str] = None
    story: Optional[str] = None
    mood: Optional[str] = None
    aroma_notes: Optional[AromaNotes] = None
    image_url: Optional[str] = None

class Review(BaseModel):
    reviewer_name: str
    rating: int
    comment: str
    date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    island_id: str
    island_name: str
    price: float
    stock: int
    size: str
    description: str
    aroma_notes: AromaNotes
    olfactive_family: str
    mood: str
    image_url: str
    reviews: List[Review] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProductCreate(BaseModel):
    name: str
    island_id: str
    island_name: str
    price: float
    stock: int
    size: str = "50ml"
    description: str
    aroma_notes: AromaNotes
    olfactive_family: str
    mood: str
    image_url: str

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    size: Optional[str] = None
    description: Optional[str] = None
    aroma_notes: Optional[AromaNotes] = None
    olfactive_family: Optional[str] = None
    mood: Optional[str] = None
    image_url: Optional[str] = None

class QuizOption(BaseModel):
    text: str
    island_weights: Dict[str, int]  # island_id -> weight score

class QuizQuestion(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question: str
    options: List[QuizOption]

class Quiz(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = "quiz_config"
    questions: List[QuizQuestion]
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class QuizSubmission(BaseModel):
    answers: List[str]  # list of selected option texts

class OrderItem(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    price: float

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    customer_address: str
    items: List[OrderItem]
    total: float
    status: str = "pending"  # pending, confirmed, shipped, delivered, cancelled
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    customer_address: str
    items: List[OrderItem]
    notes: Optional[str] = None

class OrderStatusUpdate(BaseModel):
    status: str

class ThemeSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = "theme_settings"
    primary_color: str = "#2C3639"
    secondary_color: str = "#DCD7C9"
    accent_color: str = "#A27B5C"
    hero_images: List[str] = []
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ThemeUpdate(BaseModel):
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    accent_color: Optional[str] = None
    hero_images: Optional[List[str]] = None

class FAQItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question: str
    answer: str
    order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class FAQCreate(BaseModel):
    question: str
    answer: str
    order: int = 0

class FAQUpdate(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None
    order: Optional[int] = None

# ========== AUTH HELPERS ==========

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid authentication")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication")
    
    user = await db.users.find_one({"username": username}, {"_id": 0})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return User(**user)

# ========== AUTH ROUTES ==========

@api_router.post("/auth/register", response_model=User)
async def register(user_data: UserCreate):
    existing = await db.users.find_one({"username": user_data.username}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    user = User(
        username=user_data.username,
        email=user_data.email
    )
    
    user_dict = user.model_dump()
    user_dict["password"] = get_password_hash(user_data.password)
    user_dict["created_at"] = user_dict["created_at"].isoformat()
    
    await db.users.insert_one(user_dict)
    return user

@api_router.post("/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"username": credentials.username}, {"_id": 0})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user["username"]})
    return Token(access_token=access_token, token_type="bearer")

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# ========== ISLANDS ROUTES ==========

@api_router.get("/islands", response_model=List[Island])
async def get_islands():
    islands = await db.islands.find({}, {"_id": 0}).to_list(100)
    for island in islands:
        if isinstance(island.get("created_at"), str):
            island["created_at"] = datetime.fromisoformat(island["created_at"])
    return islands

@api_router.get("/islands/{island_id}", response_model=Island)
async def get_island(island_id: str):
    island = await db.islands.find_one({"id": island_id}, {"_id": 0})
    if not island:
        raise HTTPException(status_code=404, detail="Island not found")
    if isinstance(island.get("created_at"), str):
        island["created_at"] = datetime.fromisoformat(island["created_at"])
    return Island(**island)

@api_router.put("/admin/islands/{island_id}", response_model=Island)
async def update_island(
    island_id: str,
    update_data: IslandUpdate,
    current_user: User = Depends(get_current_user)
):
    island = await db.islands.find_one({"id": island_id}, {"_id": 0})
    if not island:
        raise HTTPException(status_code=404, detail="Island not found")
    
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    if update_dict:
        await db.islands.update_one({"id": island_id}, {"$set": update_dict})
    
    updated_island = await db.islands.find_one({"id": island_id}, {"_id": 0})
    if isinstance(updated_island.get("created_at"), str):
        updated_island["created_at"] = datetime.fromisoformat(updated_island["created_at"])
    return Island(**updated_island)

# ========== PRODUCTS ROUTES ==========

@api_router.get("/products", response_model=List[Product])
async def get_products(
    island_id: Optional[str] = None,
    mood: Optional[str] = None,
    olfactive_family: Optional[str] = None
):
    query = {}
    if island_id:
        query["island_id"] = island_id
    if mood:
        query["mood"] = mood
    if olfactive_family:
        query["olfactive_family"] = olfactive_family
    
    products = await db.products.find(query, {"_id": 0}).to_list(100)
    for product in products:
        if isinstance(product.get("created_at"), str):
            product["created_at"] = datetime.fromisoformat(product["created_at"])
        for review in product.get("reviews", []):
            if isinstance(review.get("date"), str):
                review["date"] = datetime.fromisoformat(review["date"])
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if isinstance(product.get("created_at"), str):
        product["created_at"] = datetime.fromisoformat(product["created_at"])
    for review in product.get("reviews", []):
        if isinstance(review.get("date"), str):
            review["date"] = datetime.fromisoformat(review["date"])
    return Product(**product)

@api_router.post("/admin/products", response_model=Product)
async def create_product(
    product_data: ProductCreate,
    current_user: User = Depends(get_current_user)
):
    product = Product(**product_data.model_dump())
    product_dict = product.model_dump()
    product_dict["created_at"] = product_dict["created_at"].isoformat()
    
    await db.products.insert_one(product_dict)
    return product

@api_router.put("/admin/products/{product_id}", response_model=Product)
async def update_product(
    product_id: str,
    update_data: ProductUpdate,
    current_user: User = Depends(get_current_user)
):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    if update_dict:
        await db.products.update_one({"id": product_id}, {"$set": update_dict})
    
    updated_product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if isinstance(updated_product.get("created_at"), str):
        updated_product["created_at"] = datetime.fromisoformat(updated_product["created_at"])
    return Product(**updated_product)

@api_router.delete("/admin/products/{product_id}")
async def delete_product(
    product_id: str,
    current_user: User = Depends(get_current_user)
):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted"}

# ========== QUIZ ROUTES ==========

@api_router.get("/quiz", response_model=Quiz)
async def get_quiz():
    quiz = await db.quiz.find_one({"id": "quiz_config"}, {"_id": 0})
    if not quiz:
        # Return default quiz if not exists
        return Quiz(questions=[])
    if isinstance(quiz.get("updated_at"), str):
        quiz["updated_at"] = datetime.fromisoformat(quiz["updated_at"])
    return Quiz(**quiz)

@api_router.post("/quiz/submit")
async def submit_quiz(submission: QuizSubmission):
    quiz = await db.quiz.find_one({"id": "quiz_config"}, {"_id": 0})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not configured")
    
    # Calculate scores for each island
    island_scores = {}
    for answer_text in submission.answers:
        for question in quiz["questions"]:
            for option in question["options"]:
                if option["text"] == answer_text:
                    for island_id, weight in option["island_weights"].items():
                        island_scores[island_id] = island_scores.get(island_id, 0) + weight
    
    # Get recommended island
    if not island_scores:
        raise HTTPException(status_code=400, detail="No valid answers")
    
    recommended_island_id = max(island_scores, key=island_scores.get)
    island = await db.islands.find_one({"id": recommended_island_id}, {"_id": 0})
    
    if not island:
        raise HTTPException(status_code=404, detail="Recommended island not found")
    
    # Get products for this island
    products = await db.products.find({"island_id": recommended_island_id}, {"_id": 0}).to_list(10)
    
    return {
        "island": island,
        "products": products
    }

@api_router.put("/admin/quiz", response_model=Quiz)
async def update_quiz(
    quiz_data: Quiz,
    current_user: User = Depends(get_current_user)
):
    quiz_dict = quiz_data.model_dump()
    quiz_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.quiz.update_one(
        {"id": "quiz_config"},
        {"$set": quiz_dict},
        upsert=True
    )
    return quiz_data

# ========== ORDERS ROUTES ==========

@api_router.post("/orders", response_model=Order)
async def create_order(order_data: OrderCreate):
    # Calculate total
    total = sum(item.price * item.quantity for item in order_data.items)
    
    order = Order(
        **order_data.model_dump(),
        total=total
    )
    
    order_dict = order.model_dump()
    order_dict["created_at"] = order_dict["created_at"].isoformat()
    
    await db.orders.insert_one(order_dict)
    return order

@api_router.get("/admin/orders", response_model=List[Order])
async def get_orders(current_user: User = Depends(get_current_user)):
    orders = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for order in orders:
        if isinstance(order.get("created_at"), str):
            order["created_at"] = datetime.fromisoformat(order["created_at"])
    return orders

@api_router.put("/admin/orders/{order_id}", response_model=Order)
async def update_order_status(
    order_id: str,
    status_update: OrderStatusUpdate,
    current_user: User = Depends(get_current_user)
):
    result = await db.orders.update_one(
        {"id": order_id},
        {"$set": {"status": status_update.status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if isinstance(order.get("created_at"), str):
        order["created_at"] = datetime.fromisoformat(order["created_at"])
    return Order(**order)

# ========== THEME ROUTES ==========

@api_router.get("/theme", response_model=ThemeSettings)
async def get_theme():
    theme = await db.theme.find_one({"id": "theme_settings"}, {"_id": 0})
    if not theme:
        return ThemeSettings()
    if isinstance(theme.get("updated_at"), str):
        theme["updated_at"] = datetime.fromisoformat(theme["updated_at"])
    return ThemeSettings(**theme)

@api_router.put("/admin/theme", response_model=ThemeSettings)
async def update_theme(
    theme_update: ThemeUpdate,
    current_user: User = Depends(get_current_user)
):
    update_dict = {k: v for k, v in theme_update.model_dump().items() if v is not None}
    update_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.theme.update_one(
        {"id": "theme_settings"},
        {"$set": update_dict},
        upsert=True
    )
    
    theme = await db.theme.find_one({"id": "theme_settings"}, {"_id": 0})
    if isinstance(theme.get("updated_at"), str):
        theme["updated_at"] = datetime.fromisoformat(theme["updated_at"])
    return ThemeSettings(**theme)

# ========== FAQ ROUTES ==========

@api_router.get("/faq", response_model=List[FAQItem])
async def get_faqs():
    faqs = await db.faq.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    for faq in faqs:
        if isinstance(faq.get("created_at"), str):
            faq["created_at"] = datetime.fromisoformat(faq["created_at"])
    return faqs

@api_router.post("/admin/faq", response_model=FAQItem)
async def create_faq(
    faq_data: FAQCreate,
    current_user: User = Depends(get_current_user)
):
    faq = FAQItem(**faq_data.model_dump())
    faq_dict = faq.model_dump()
    faq_dict["created_at"] = faq_dict["created_at"].isoformat()
    
    await db.faq.insert_one(faq_dict)
    return faq

@api_router.put("/admin/faq/{faq_id}", response_model=FAQItem)
async def update_faq(
    faq_id: str,
    update_data: FAQUpdate,
    current_user: User = Depends(get_current_user)
):
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    if update_dict:
        result = await db.faq.update_one({"id": faq_id}, {"$set": update_dict})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="FAQ not found")
    
    faq = await db.faq.find_one({"id": faq_id}, {"_id": 0})
    if isinstance(faq.get("created_at"), str):
        faq["created_at"] = datetime.fromisoformat(faq["created_at"])
    return FAQItem(**faq)

@api_router.delete("/admin/faq/{faq_id}")
async def delete_faq(
    faq_id: str,
    current_user: User = Depends(get_current_user)
):
    result = await db.faq.delete_one({"id": faq_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="FAQ not found")
    return {"message": "FAQ deleted"}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
