import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = Path(os.environ.get("MODEL_PATH", BASE_DIR / "model" / "plant_disease_cnn.keras"))
LABELS_PATH = Path(os.environ.get("LABELS_PATH", BASE_DIR / "model" / "class_labels.json"))
CORS_ORIGINS = [
    origin.strip()
    for origin in os.environ.get("CORS_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]
MAX_UPLOAD_MB = int(os.environ.get("MAX_UPLOAD_MB", "10"))
PORT = int(os.environ.get("PORT", "5000"))

# Multiplier applied to raw 0-255 pixel values before they reach the model.
# Must match the scaling used when the model was trained.
PIXEL_SCALE = float(os.environ.get("PIXEL_SCALE", str(1 / 255)))
