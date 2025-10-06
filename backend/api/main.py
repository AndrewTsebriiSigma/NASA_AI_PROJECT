from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import pandas as pd
import numpy as np
import io
import json
from datetime import datetime

# Import ML wrappers
from ml_wrappers import (
    load_k2_models,
    load_tess_models,
    classify_k2_data,
    classify_tess_data,
    calculate_habitability_k2,
    calculate_habitability_tess,
    run_triceratops_fpp,
    generate_charts_from_lightcurve
)

app = FastAPI(
    title="NASA Exoplanet Classification API",
    description="Backend API for ExoScope - Exoplanet Classification System",
    version="1.0.0"
)

# CORS middleware for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models at startup
k2_models = None
tess_models = None

@app.on_event("startup")
async def startup_event():
    """Load ML models on startup"""
    global k2_models, tess_models
    try:
        k2_models = load_k2_models()
        tess_models = load_tess_models()
        print("✓ Models loaded successfully")
    except Exception as e:
        print(f"⚠ Warning: Could not load all models: {e}")


# ============================================================================
# Request/Response Models
# ============================================================================

class ModelInfo(BaseModel):
    id: str
    name: str
    description: str
    metrics: Dict[str, float]

class ClassificationRequest(BaseModel):
    data: List[Dict[str, Any]]  # Accept any type (float, str, int, None)
    model_type: str  # 'random_forest' or 'mlp'
    dataset: str  # 'k2' or 'tess'
    threshold: Optional[float] = 0.5

class ClassificationResponse(BaseModel):
    prediction: str
    confidence: float
    probabilities: Dict[str, float]
    explainability: Dict
    charts: Optional[Dict] = None

class HabitabilityRequest(BaseModel):
    planet_data: Dict[str, float]
    dataset: str  # 'k2' or 'tess'

class TriceratopsRequest(BaseModel):
    planet_data: Dict
    search_radius: Optional[int] = 10


# ============================================================================
# API Endpoints
# ============================================================================

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "NASA Exoplanet Classification API",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/models", response_model=List[ModelInfo])
async def get_models():
    """Get list of available classification models"""
    return [
        {
            "id": "random_forest_k2",
            "name": "Random Forest (K2)",
            "description": "Random Forest classifier trained on K2 mission data with SMOTE",
            "metrics": {"precision": 0.91, "recall": 0.88, "f1": 0.89}
        },
        {
            "id": "mlp_k2",
            "name": "Neural Network (K2)",
            "description": "Multi-layer Perceptron trained on K2 mission data",
            "metrics": {"precision": 0.87, "recall": 0.85, "f1": 0.86}
        },
        {
            "id": "random_forest_tess",
            "name": "Random Forest (TESS)",
            "description": "Random Forest classifier trained on TESS mission data with SMOTE",
            "metrics": {"precision": 0.89, "recall": 0.86, "f1": 0.87}
        },
        {
            "id": "mlp_tess",
            "name": "Neural Network (TESS)",
            "description": "Multi-layer Perceptron trained on TESS mission data",
            "metrics": {"precision": 0.85, "recall": 0.83, "f1": 0.84}
        },
        {
            "id": "triceratops",
            "name": "TRICERATOPS FPP",
            "description": "False Positive Probability analysis using TRICERATOPS",
            "metrics": {"precision": 0.93, "recall": 0.90, "f1": 0.91}
        }
    ]

@app.post("/api/classify", response_model=ClassificationResponse)
async def classify_lightcurve(request: ClassificationRequest):
    """
    Classify exoplanet data using the specified model
    """
    try:
        # Convert data to DataFrame
        df = pd.DataFrame(request.data)
        
        print(f"Received {len(df)} rows with {len(df.columns)} columns")
        print(f"Columns: {df.columns.tolist()[:10]}...")  # Print first 10 columns
        print(f"Model: {request.model_type}, Dataset: {request.dataset}")
        
        # Check if models are loaded
        if request.dataset == "k2" and k2_models is None:
            raise HTTPException(status_code=503, detail="K2 models not loaded yet")
        if request.dataset == "tess" and tess_models is None:
            raise HTTPException(status_code=503, detail="TESS models not loaded yet")
        
        # Determine which model to use
        if request.dataset == "k2":
            if request.model_type == "random_forest":
                result = classify_k2_data(df, k2_models["rf"], k2_models["scaler"], k2_models["features"])
            else:  # mlp
                result = classify_k2_data(df, k2_models["mlp"], k2_models["scaler"], k2_models["features"])
        else:  # tess
            if request.model_type == "random_forest":
                result = classify_tess_data(df, tess_models["rf"], tess_models["scaler"], tess_models["features"])
            else:  # mlp
                result = classify_tess_data(df, tess_models["mlp"], tess_models["scaler"], tess_models["features"])
        
        # Generate charts if light curve data is available
        charts = generate_charts_from_lightcurve(df)
        result["charts"] = charts
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Classification failed: {str(e)}")

@app.post("/api/upload")
async def upload_lightcurve(file: UploadFile = File(...)):
    """
    Upload and parse a CSV file (light curve or exoplanet parameters)
    """
    try:
        # Read the file
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        # Determine data type
        has_lightcurve = 'time' in df.columns and 'flux' in df.columns
        has_planet_params = any(col in df.columns for col in ['pl_name', 'st_mass', 'pl_rade', 'st_teff'])
        
        if not has_lightcurve and not has_planet_params:
            raise HTTPException(
                status_code=400, 
                detail=f"Unrecognized data format. Found columns: {list(df.columns)[:10]}..."
            )
        
        # Convert to dict format
        data = df.head(1000).to_dict('records')  # Limit to 1000 rows for performance
        
        data_type = "lightcurve" if has_lightcurve else "exoplanet_parameters"
        
        return {
            "success": True,
            "headers": list(df.columns),
            "data": data,
            "rows": len(data),
            "dataType": data_type,
            "message": f"Successfully parsed {len(data)} rows of {data_type}"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.post("/api/habitability")
async def calculate_habitability(request: HabitabilityRequest):
    """
    Calculate habitability score for a planet
    """
    try:
        if request.dataset == "k2":
            score = calculate_habitability_k2(request.planet_data)
        else:
            score = calculate_habitability_tess(request.planet_data)
        
        return {
            "habitability_score": score,
            "habitable": score > 0.5,
            "dataset": request.dataset
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Habitability calculation failed: {str(e)}")

@app.post("/api/triceratops")
async def analyze_triceratops(request: TriceratopsRequest):
    """
    Run TRICERATOPS False Positive Probability analysis
    Note: This is a computationally expensive operation
    """
    try:
        fpp, nfpp = run_triceratops_fpp(
            request.planet_data,
            search_radius=request.search_radius
        )
        
        is_planet = nfpp < 0.1 if nfpp != "Nan" else None
        
        return {
            "FPP": fpp,
            "NFPP": nfpp,
            "is_confirmed_planet": is_planet,
            "threshold": 0.1,
            "message": "Planet confirmed" if is_planet else "Not a planet" if is_planet is False else "Analysis failed"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TRICERATOPS analysis failed: {str(e)}")

@app.get("/api/health")
async def health_check():
    """Check if models are loaded and ready"""
    return {
        "status": "healthy",
        "models_loaded": {
            "k2": k2_models is not None,
            "tess": tess_models is not None
        },
        "timestamp": datetime.utcnow().isoformat()
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

