from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Import the router we just created
from routes import router

# Load environment variables (GOOGLE_API_KEY)
load_dotenv()

app = FastAPI(title="Skill-Bridge Career Navigator API")

# --- CORS SETUP ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- INCLUDE ROUTES ---
app.include_router(router)

# Basic health check
@app.get("/")
async def root():
    return {"status": "ok", "message": "Skill-Bridge API is running and modularized."}