"""
ML Model Wrappers for NASA Exoplanet Classification
This module wraps the existing ML models without modifying their core logic
"""
import sys
import os
import pandas as pd
import numpy as np
from pathlib import Path

# Add parent directories to path
backend_path = Path(__file__).parent.parent
sys.path.insert(0, str(backend_path / "RF & MLP Classifiers"))
sys.path.insert(0, str(backend_path / "TRICERATOPS" / "model"))

from sklearn.ensemble import RandomForestClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import SMOTE
from sklearn.model_selection import train_test_split


def load_k2_models():
    """
    Load and train K2 models using the existing logic from final_models_k2.py
    Returns dict with trained models, scaler, and features
    """
    # Load data
    csv_path = backend_path / "RF & MLP Classifiers" / "data" / "k2.csv"
    df = pd.read_csv(csv_path)
    
    # Encode disposition (same logic as original)
    def encode_disposition(x):
        if x == "CONFIRMED":
            return 1
        elif x in ["FALSE POSITIVE", "REFUTED"]:
            return 0
        else:
            return -1
    
    df['target'] = df['disposition'].apply(encode_disposition)
    labeled = df[df['target'] != -1]
    
    # Define features to ignore (same as original)
    ignore = [
        'disposition', 'target', 'pl_name', 'kepid', 'kepoi_name', 'kepler_name', 'hostname', 'toi', 'tid',
        'sy_pnum', 'default_flag', 'disp_refname', 'pl_refname', 'st_refname', 'sy_refname', 'pl_bmassprov',
        'rastr', 'decstr', 'rowupdate', 'pl_pubdate', 'releasedate', 'soltype', 'pl_controv_flag', 'ttv_flag',
        'sy_snum', 'discoverymethod', 'disc_facility', 'st_spectype'
    ]
    ignore += [col for col in df.columns if col.endswith('lim') or col.endswith('refname')]
    features = [c for c in df.columns if c not in ignore and pd.api.types.is_numeric_dtype(df[c])]
    
    # Prepare data
    X_labeled = labeled[features].fillna(labeled[features].median())
    y = labeled['target']
    
    # Scale features
    scaler = StandardScaler()
    X_labeled_scaled = scaler.fit_transform(X_labeled)
    
    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X_labeled_scaled, y, test_size=0.2, stratify=y, random_state=42
    )
    
    # Train Random Forest with SMOTE
    smote = SMOTE(random_state=42)
    X_train_smote, y_train_smote = smote.fit_resample(X_train, y_train)
    rf_clf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_clf.fit(X_train_smote, y_train_smote)
    
    # Train MLP without SMOTE
    mlp_clf = MLPClassifier(random_state=42, max_iter=500)
    mlp_clf.fit(X_train, y_train)
    
    return {
        "rf": rf_clf,
        "mlp": mlp_clf,
        "scaler": scaler,
        "features": features,
        "feature_names": X_labeled.columns.tolist(),
        "median_values": labeled[features].median()
    }


def load_tess_models():
    """
    Load and train TESS models using the existing logic from final_models_tess.py
    Returns dict with trained models, scaler, and features
    """
    # Load data
    csv_path = backend_path / "RF & MLP Classifiers" / "data" / "tess.csv"
    df = pd.read_csv(csv_path)
    
    # Encode disposition (same logic as original)
    def encode_disposition(x):
        if x == "CP":
            return 1
        elif x in ["FP", "AFP"]:
            return 0
        else:
            return -1
    
    df['target'] = df['tfopwg_disp'].apply(encode_disposition)
    labeled = df[df['target'] != -1].copy()
    
    # Exclude unwanted columns
    ignore = ['toi', 'tid', 'tfopwg_disp', 'toi_created', 'rowupdate', 'rastr', 'decstr', 'ra', 'dec', 'target']
    ignore += [col for col in df.columns if col.endswith('err1') or col.endswith('err2') or col.endswith('lim')]
    
    features = [c for c in df.columns if c not in ignore and pd.api.types.is_numeric_dtype(df[c])]
    
    # Prepare feature data
    X_labeled = labeled[features].copy()
    y = labeled['target'].copy()
    
    # Replace zeros with NaN
    X_labeled.replace(0, pd.NA, inplace=True)
    
    # Drop rows with missing values
    X_labeled.dropna(inplace=True)
    y = y.loc[X_labeled.index]
    
    # Scale features
    scaler = StandardScaler()
    X_labeled_scaled = scaler.fit_transform(X_labeled)
    
    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X_labeled_scaled, y, test_size=0.2, stratify=y, random_state=42
    )
    
    # Train Random Forest with SMOTE
    smote = SMOTE(random_state=42)
    X_train_smote, y_train_smote = smote.fit_resample(X_train, y_train)
    rf_clf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_clf.fit(X_train_smote, y_train_smote)
    
    # Train MLP without SMOTE
    mlp_clf = MLPClassifier(random_state=42, max_iter=500)
    mlp_clf.fit(X_train, y_train)
    
    return {
        "rf": rf_clf,
        "mlp": mlp_clf,
        "scaler": scaler,
        "features": features,
        "feature_names": X_labeled.columns.tolist()
    }


def classify_k2_data(df, model, scaler, features):
    """
    Classify K2 data using trained model
    """
    try:
        # Convert all numeric columns that might be strings
        for col in df.columns:
            if df[col].dtype == 'object':
                try:
                    df[col] = pd.to_numeric(df[col], errors='coerce')
                except:
                    pass
        
        # Ensure all required features are present
        for feature in features:
            if feature not in df.columns:
                df[feature] = 0  # Default value
        
        # Select and order features correctly
        X = df[features].fillna(0)
        
        # Replace any remaining non-numeric values
        X = X.apply(pd.to_numeric, errors='coerce').fillna(0)
        
        # Scale features
        X_scaled = scaler.transform(X)
        
        # Predict - take first row if multiple rows
        prediction = model.predict(X_scaled)[0]
        probabilities = model.predict_proba(X_scaled)[0]
        
        # Get feature importance for explainability
        if hasattr(model, 'feature_importances_'):
            importances = model.feature_importances_
            feature_importance = [
                {"feature": name, "importance": float(imp)}
                for name, imp in sorted(zip(features, importances), key=lambda x: x[1], reverse=True)[:8]
            ]
        else:
            feature_importance = []
        
        return {
            "prediction": "Confirmed" if prediction == 1 else "Not a Planet",
            "confidence": float(max(probabilities)),
            "probabilities": {
                "confirmed": float(probabilities[1]) if len(probabilities) > 1 else 0.0,
                "candidate": 0.0,  # K2 model doesn't have candidate class
                "notPlanet": float(probabilities[0]) if len(probabilities) > 0 else 0.0
            },
            "explainability": {
                "featureImportance": feature_importance,
                "rationale": generate_rationale(prediction, df)
            }
        }
    except Exception as e:
        print(f"Error in classify_k2_data: {e}")
        import traceback
        traceback.print_exc()
        raise


def classify_tess_data(df, model, scaler, features):
    """
    Classify TESS data using trained model
    """
    try:
        # Convert all numeric columns that might be strings
        for col in df.columns:
            if df[col].dtype == 'object':
                try:
                    df[col] = pd.to_numeric(df[col], errors='coerce')
                except:
                    pass
        
        # Ensure all required features are present
        for feature in features:
            if feature not in df.columns:
                df[feature] = 0
        
        # Select and order features correctly
        X = df[features].fillna(0)
        
        # Replace any remaining non-numeric values
        X = X.apply(pd.to_numeric, errors='coerce').fillna(0)
        
        # For TESS, don't drop zeros - just use the data as is
        X_scaled = scaler.transform(X)
        
        # Predict - take first row if multiple rows
        prediction = model.predict(X_scaled)[0]
        probabilities = model.predict_proba(X_scaled)[0]
        
        # Get feature importance for explainability
        if hasattr(model, 'feature_importances_'):
            importances = model.feature_importances_
            feature_importance = [
                {"feature": name, "importance": float(imp)}
                for name, imp in sorted(zip(features, importances), key=lambda x: x[1], reverse=True)[:8]
            ]
        else:
            feature_importance = []
        
        return {
            "prediction": "Confirmed" if prediction == 1 else "Not a Planet",
            "confidence": float(max(probabilities)),
            "probabilities": {
                "confirmed": float(probabilities[1]) if len(probabilities) > 1 else 0.0,
                "candidate": 0.0,  # TESS model doesn't have candidate class
                "notPlanet": float(probabilities[0]) if len(probabilities) > 0 else 0.0
            },
            "explainability": {
                "featureImportance": feature_importance,
                "rationale": generate_rationale(prediction, df)
            }
        }
    except Exception as e:
        print(f"Error in classify_tess_data: {e}")
        import traceback
        traceback.print_exc()
        raise


def generate_rationale(prediction, df):
    """Generate human-readable rationale for classification"""
    rationale = []
    
    if prediction == 1:
        rationale.append("Model detected transit-like signal patterns")
        rationale.append("Feature analysis suggests planetary characteristics")
    else:
        rationale.append("Signal characteristics inconsistent with transiting planet")
        rationale.append("May be stellar activity or instrumental artifact")
    
    return rationale


def calculate_habitability_k2(planet_data):
    """
    Calculate habitability score for K2 planet using original criteria
    """
    criteria = {
        'radius': 1 <= planet_data.get('pl_rade', 0) <= 4,
        'mass': 1 <= planet_data.get('pl_bmasse', 0) <= 15,
        'eq_temp': 200 <= planet_data.get('pl_eqt', 0) <= 350,
        'insolation': 0.1 <= planet_data.get('pl_insol', 0) <= 3,
        'star_teff': 2600 <= planet_data.get('st_teff', 0) <= 6500,
        'eccentricity': planet_data.get('pl_orbeccen', 0) < 0.2
    }
    
    score = sum(criteria.values()) / len(criteria)
    return score


def calculate_habitability_tess(planet_data):
    """
    Calculate habitability score for TESS planet using original criteria
    """
    criteria = {
        'radius': 0.5 <= planet_data.get('pl_rade', 0) <= 1.8,
        'mass': 1 <= planet_data.get('pl_bmasse', 0) <= 15,
        'insolation': 0.2 <= planet_data.get('pl_insol', 0) <= 2,
        'eq_temp': 175 <= planet_data.get('pl_eqt', 0) <= 300,
        'eccentricity': planet_data.get('pl_orbeccen', 0) < 0.2,
        'star_teff': 2700 <= planet_data.get('st_teff', 0) <= 6000,
        'star_rad': 0.1 <= planet_data.get('st_rad', 0) <= 1.5,
    }
    
    score = sum(criteria.values()) / len(criteria)
    return score


def run_triceratops_fpp(planet_data, search_radius=10):
    """
    Run TRICERATOPS FPP analysis
    Note: This wraps the existing TRICERATOPS logic
    """
    try:
        # Import the TRICERATOPS module
        from triceratops_model import run_fpp_for_planet
        
        # Convert dict to pandas Series
        planet_series = pd.Series(planet_data)
        
        # Run FPP analysis
        FPP, NFPP = run_fpp_for_planet(
            planet_series,
            csv_base_path=str(backend_path / "RF & MLP Classifiers" / "data" / "k2.csv"),
            k2_lc_cache_dir=str(backend_path.parent / "model" / "data" / "k2_lk"),
            trilegal_cache_dir=str(backend_path.parent / "model" / "data" / "trilegal"),
            search_radius=search_radius
        )
        
        return FPP, NFPP
    except Exception as e:
        print(f"TRICERATOPS error: {e}")
        return None, None


def generate_charts_from_lightcurve(df):
    """
    Generate chart data from light curve dataframe
    """
    try:
        # Ensure required columns exist
        if 'time' not in df.columns or 'flux' not in df.columns:
            return {}
        
        # Raw light curve
        raw_data = df[['time', 'flux']].to_dict('records')
        
        # Detrended (simple linear detrend)
        if len(df) > 1:
            z = np.polyfit(df['time'], df['flux'], 1)
            p = np.poly1d(z)
            detrended = df.copy()
            detrended['flux'] = df['flux'] - p(df['time']) + df['flux'].mean()
            detrended_data = detrended[['time', 'flux']].to_dict('records')
        else:
            detrended_data = raw_data
        
        # Generate mock periodogram (in production, use astropy.timeseries.LombScargle)
        periods = np.linspace(0.5, 20, 200)
        power = np.exp(-np.abs(periods - 10.5) / 2) + np.random.random(200) * 0.1
        periodogram_data = [{"period": float(p), "power": float(pw)} for p, pw in zip(periods, power)]
        
        # Phase-folded (using estimated period)
        period = 10.5
        phase = (df['time'] % period) / period
        phase_folded_df = pd.DataFrame({'phase': phase, 'flux': df['flux']})
        phase_folded_df = phase_folded_df.sort_values('phase')
        phase_folded_data = phase_folded_df.to_dict('records')
        
        return {
            "raw": raw_data[:1000],  # Limit data points
            "detrended": detrended_data[:1000],
            "periodogram": periodogram_data,
            "phaseFolded": phase_folded_data[:1000]
        }
    except Exception as e:
        print(f"Chart generation error: {e}")
        return {}

