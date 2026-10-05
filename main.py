import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from app.config import UPLOAD_DIR
from app.database.session import engine, Base, SessionLocal
from app.api import machines, audio, analysis, dashboard, demo
from app.api.demo import seed_demo_data

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AcoustiGuard AI - Backend API",
    description=(
        "AI-Powered Acoustic Predictive Maintenance Platform API.\n"
        "Analyzes machine sound signatures using signal preprocessing, 8 extracted acoustic features, "
        "Isolation Forest anomaly detection, and per-machine baseline vectors."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure upload directories exist
spectrogram_dir = UPLOAD_DIR / "spectrograms"
spectrogram_dir.mkdir(parents=True, exist_ok=True)

# Mount static files
app.mount("/static/spectrograms", StaticFiles(directory=str(spectrogram_dir)), name="spectrograms")
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR.parent)), name="uploads")

# Exception handler for clean error responses
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": f"An unexpected server error occurred: {str(exc)}"}
    )

# Include API Routers
app.include_router(machines.router)
app.include_router(audio.router)
app.include_router(analysis.router)
app.include_router(dashboard.router)
app.include_router(demo.router)


@app.on_event("startup")
def on_startup():
    """Auto-seed demo data on startup if database is brand new."""
    db = SessionLocal()
    try:
        seed_demo_data(db)
    except Exception as e:
        print(f"Startup seed notice: {e}")
    finally:
        db.close()


@app.get("/", tags=["Health Check"])
def root():
    return {
        "application": "AcoustiGuard AI",
        "subtitle": "AI-Powered Acoustic Predictive Maintenance",
        "status": "Online",
        "documentation": "/docs"
    }
