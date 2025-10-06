# NASA Exoplanet Classification API

FastAPI backend for the ExoScope exoplanet classification system.

## Features

- **RF & MLP Classifiers**: Random Forest and Multi-Layer Perceptron models trained on K2 and TESS mission data
- **TRICERATOPS Integration**: False Positive Probability (FPP) analysis
- **Habitability Scoring**: Calculate habitability scores for detected planets
- **Light Curve Analysis**: Automated chart generation and period detection

## Setup

### 1. Install Dependencies

```bash
# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Verify Data Files

Ensure the following data files exist:
- `../RF & MLP Classifiers/data/k2.csv`
- `../RF & MLP Classifiers/data/tess.csv`

### 3. Start the API

```bash
# Using the startup script (recommended)
python start_api.py

# Or directly with uvicorn
uvicorn main:app --reload --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Health Check
```http
GET /
GET /api/health
```

### Get Available Models
```http
GET /api/models
```

Returns list of available classification models with metrics.

### Classify Light Curve
```http
POST /api/classify
Content-Type: application/json

{
  "data": [{"time": 0.0, "flux": 1.0}, ...],
  "model_type": "random_forest",
  "dataset": "k2",
  "threshold": 0.5
}
```

### Upload CSV
```http
POST /api/upload
Content-Type: multipart/form-data

file: <CSV file>
```

### Calculate Habitability
```http
POST /api/habitability
Content-Type: application/json

{
  "planet_data": {
    "pl_rade": 1.2,
    "pl_bmasse": 3.5,
    "pl_eqt": 288,
    ...
  },
  "dataset": "k2"
}
```

### TRICERATOPS Analysis
```http
POST /api/triceratops
Content-Type: application/json

{
  "planet_data": {
    "hostname": "EPIC 12345",
    "ra": 280.5,
    "dec": 44.3,
    ...
  },
  "search_radius": 10
}
```

## Model Details

### K2 Models
- **Random Forest**: Trained with SMOTE on K2 mission data
  - F1 Score: 0.89
  - Features: Extracted from NASA Exoplanet Archive
  
- **MLP Classifier**: Neural network trained on K2 data
  - F1 Score: 0.86
  - Architecture: Multi-layer perceptron with adaptive learning

### TESS Models
- **Random Forest**: Trained with SMOTE on TESS mission data
  - F1 Score: 0.87
  
- **MLP Classifier**: Neural network trained on TESS data
  - F1 Score: 0.84

## Architecture

```
backend/api/
├── main.py              # FastAPI application
├── ml_wrappers.py       # ML model wrapper functions
├── requirements.txt     # Python dependencies
├── start_api.py         # Startup script
└── README.md           # This file
```

## Important Notes

1. **Model Loading**: Models are trained on startup, which may take 30-60 seconds
2. **TRICERATOPS**: Requires additional dependencies and is computationally expensive
3. **CORS**: Currently allows all origins - restrict in production
4. **Data Requirements**: Light curves must include `time` and `flux` columns

## Troubleshooting

### Models not loading
- Verify data files exist in correct locations
- Check Python version (3.8-3.11 recommended)
- Ensure all dependencies are installed

### TRICERATOPS errors
- Verify lightkurve and triceratops packages are installed
- Check cache directories are writable
- EPIC targets only (K2 mission)

### API timeout
- Increase timeout in frontend (default: 120s)
- Use background tasks for long-running operations

## Frontend Integration

Update frontend environment variable:
```env
VITE_API_URL=http://localhost:8000
```

## Production Deployment

For production:
1. Set specific CORS origins in `main.py`
2. Use production ASGI server (gunicorn + uvicorn)
3. Implement authentication if needed
4. Set up SSL/TLS certificates
5. Configure proper logging and monitoring

## License

Part of NASA AI Project - Exoplanet Classification System

