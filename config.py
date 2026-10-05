import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Storage configuration
UPLOAD_DIR = BASE_DIR / "uploads" / "audio"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/acoustiguard.db")

# Audio Processing Configuration
DEFAULT_SAMPLE_RATE = 22050  # Standard audio sample rate for acoustic analysis
MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024  # 25 MB max file size
ALLOWED_AUDIO_EXTENSIONS = {".wav", ".mp3", ".flac", ".m4a", ".ogg", ".webm"}

# ML Configuration
BASELINE_MIN_SAMPLES = 3  # Minimum baseline audio recordings before full comparison
BASELINE_RECOMMENDED_SAMPLES = 5
ISOLATION_FOREST_CONTAMINATION = 0.1  # Expected proportion of outliers in baseline data
N_MFCC = 13
