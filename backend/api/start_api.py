"""
Startup script for the FastAPI backend
"""
import uvicorn
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

if __name__ == "__main__":
    print("=" * 70)
    print("🚀 Starting NASA Exoplanet Classification API")
    print("=" * 70)
    print("\n📡 API will be available at: http://localhost:8000")
    print("📚 API documentation: http://localhost:8000/docs")
    print("📖 Alternative docs: http://localhost:8000/redoc")
    print("\n⚙️  Loading ML models (this may take a moment)...")
    print("\n" + "=" * 70 + "\n")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

