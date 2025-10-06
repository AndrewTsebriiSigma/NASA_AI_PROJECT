# ExoScope - NASA Exoplanet Classification System

AI-powered exoplanet detection and classification system using machine learning models trained on NASA K2 and TESS mission data.

![Project Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🌟 Features

- **Advanced ML Classification**: Random Forest and Neural Network models for K2 and TESS data
- **TRICERATOPS Integration**: False Positive Probability (FPP) analysis
- **Habitability Scoring**: Automated calculation of planetary habitability metrics
- **Light Curve Analysis**: Interactive visualization and analysis tools
- **Real-time Processing**: FastAPI backend for efficient model inference
- **Modern UI**: React-based interface with real-time updates

## 🚀 Quick Start

### Prerequisites

- **Python** 3.8-3.11
- **Node.js** 16+ and npm
- **Git**

### Installation

#### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd NASA_AI_PROJECT
```

#### 2. Set Up the Backend

```bash
# Navigate to backend API
cd backend/api

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python start_api.py
```

The backend will run on **http://localhost:8000**

See [BACKEND_SETUP.md](BACKEND_SETUP.md) for detailed backend setup instructions.

#### 3. Set Up the Frontend

Open a **new terminal** window:

```bash
# Return to project root (if in backend/api)
cd ../..

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on **http://localhost:5173**

### 4. Open the Application

Visit **http://localhost:5173** in your browser.

## 📖 Usage

### Analyzing Light Curves

1. **Navigate to the Analyze page**
2. **Upload a CSV file** containing light curve data (columns: `time`, `flux`)
   - OR search for a target by KIC/TIC identifier
3. **Select a classification model** from the dropdown
4. **Adjust the threshold** if needed
5. **Click "Run Classification"**
6. **View results**, including:
   - Classification prediction
   - Confidence scores
   - Feature importance
   - Interactive charts

### Available Models

- **Random Forest (K2)** - F1: 0.89
- **Neural Network (K2)** - F1: 0.86
- **Random Forest (TESS)** - F1: 0.87
- **Neural Network (TESS)** - F1: 0.84
- **TRICERATOPS** - FPP analysis (F1: 0.91)

## 🏗️ Project Structure

```
NASA_AI_PROJECT/
├── backend/
│   ├── api/                    # FastAPI backend
│   │   ├── main.py            # API endpoints
│   │   ├── ml_wrappers.py     # ML model wrappers
│   │   └── requirements.txt   # Python dependencies
│   ├── RF & MLP Classifiers/  # Original ML models
│   └── TRICERATOPS/           # FPP analysis
├── components/                # React components
├── pages/                     # React pages
├── lib/                       # API client
├── store/                     # State management
├── model/                     # Model data and cache
├── App.jsx                    # Main app component
├── main.jsx                   # Entry point
├── index.html                 # HTML template
├── package.json               # Node dependencies
└── vite.config.js            # Vite configuration
```

## 🔧 Configuration

### Backend Configuration

Edit `backend/api/start_api.py` to change:
- Port (default: 8000)
- Host settings
- Reload behavior

### Frontend Configuration

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8000
```

## 📊 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🧪 Testing

### Test the Backend

```bash
# Health check
curl http://localhost:8000/api/health

# List models
curl http://localhost:8000/api/models
```

### Test the Frontend

Open the browser console and run:

```javascript
fetch('http://localhost:8000/api/models')
  .then(r => r.json())
  .then(console.log)
```

## 📚 Documentation

- [Backend Setup Guide](BACKEND_SETUP.md)
- [Integration Summary](INTEGRATION_SUMMARY.md)
- [API Documentation](backend/api/README.md)

## 🛠️ Development

### Running in Development Mode

**Backend** (with auto-reload):
```bash
cd backend/api
python start_api.py
```

**Frontend** (with hot module replacement):
```bash
npm run dev
```

### Building for Production

```bash
# Build frontend
npm run build

# Preview production build
npm run preview
```

## 🐛 Troubleshooting

### "npm run dev" not working
- Ensure `package.json` exists in the project root
- Run `npm install` to install dependencies
- Check Node.js version: `node --version` (should be 16+)

### Backend models not loading
- Verify data files exist in `backend/RF & MLP Classifiers/data/`
- Check Python version: `python --version` (should be 3.8-3.11)
- Ensure all dependencies installed: `pip install -r requirements.txt`

### CORS errors
- Ensure backend is running on port 8000
- Check `VITE_API_URL` in `.env` file
- Verify frontend is making requests to correct URL

### Port already in use
- **Backend**: Change port in `start_api.py`
- **Frontend**: Change port in `vite.config.js`

## 📝 Scripts

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Backend
cd backend/api
python start_api.py  # Start API server
```

## 🔬 Machine Learning Models

### K2 Mission Models
- **Dataset**: NASA Exoplanet Archive K2 data
- **Features**: 100+ planetary and stellar parameters
- **Preprocessing**: SMOTE oversampling, StandardScaler
- **Models**: Random Forest (100 trees), MLP (adaptive learning)

### TESS Mission Models
- **Dataset**: TESS Objects of Interest (TOI)
- **Features**: Transit and stellar characteristics
- **Preprocessing**: Zero-handling, StandardScaler
- **Models**: Random Forest, MLP

### TRICERATOPS
- **Purpose**: False Positive Probability analysis
- **Method**: Statistical validation using stellar catalogs
- **Input**: EPIC targets with light curves
- **Output**: FPP and NFPP scores

## 🌍 Data Sources

- [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/)
- [MAST Archive](https://archive.stsci.edu/)
- [ExoFOP-TESS](https://exofop.ipac.caltech.edu/tess/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- NASA Exoplanet Science Institute
- Kepler/K2 and TESS mission teams
- TRICERATOPS developers
- Open source community

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review API logs and browser console
3. Consult the troubleshooting section

## 🎯 Roadmap

- [ ] Add more classification models
- [ ] Implement batch processing
- [ ] Add export functionality
- [ ] Improve chart interactions
- [ ] Add authentication
- [ ] Deploy to cloud platform

---

**Made with ❤️ for space exploration and exoplanet discovery**

