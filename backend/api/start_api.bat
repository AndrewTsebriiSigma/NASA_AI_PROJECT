@echo off
echo ================================================
echo Starting NASA Exoplanet Classification API
echo ================================================
echo.
echo Activating virtual environment (if exists)...
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
)
echo.
echo Starting FastAPI server...
python start_api.py
pause

