import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import SMOTE
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score, f1_score, roc_auc_score
from warnings import filterwarnings
filterwarnings('ignore')
import matplotlib.pyplot as plt
from sklearn.metrics import roc_curve

# Load and preprocess data
df = pd.read_csv('data/k2.csv')

def encode_disposition(x):
    if x == "CONFIRMED":
        return 1
    elif x in ["FALSE POSITIVE", "REFUTED"]:
        return 0
    else:
        return -1

df['target'] = df['disposition'].apply(encode_disposition)
labeled = df[df['target'] != -1]
candidates = df[df['target'] == -1]

ignore = [
    'disposition', 'target', 'pl_name', 'kepid', 'kepoi_name', 'kepler_name', 'hostname', 'toi', 'tid',
    'sy_pnum', 'default_flag', 'disp_refname', 'pl_refname', 'st_refname', 'sy_refname', 'pl_bmassprov',
    'rastr', 'decstr', 'rowupdate', 'pl_pubdate', 'releasedate', 'soltype', 'pl_controv_flag', 'ttv_flag',
    'sy_snum', 'discoverymethod', 'disc_facility', 'st_spectype'
]
ignore += [col for col in df.columns if col.endswith('lim') or col.endswith('refname')]
features = [c for c in df.columns if c not in ignore and pd.api.types.is_numeric_dtype(df[c])]

X_labeled = labeled[features].fillna(labeled[features].median())
X_candidates = candidates[features].fillna(labeled[features].median())
y = labeled['target']

# Scale features
scaler = StandardScaler()
X_labeled_scaled = scaler.fit_transform(X_labeled)
X_candidates_scaled = scaler.transform(X_candidates)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X_labeled_scaled, y, test_size=0.2, stratify=y, random_state=42)

# Random Forest with SMOTE
smote = SMOTE(random_state=42)
X_train_smote, y_train_smote = smote.fit_resample(X_train, y_train)
rf_clf = RandomForestClassifier(n_estimators=100, random_state=42)
rf_clf.fit(X_train_smote, y_train_smote)
rf_preds = rf_clf.predict(X_test)
rf_proba = rf_clf.predict_proba(X_test)[:, 1]
rf_f1 = f1_score(y_test, rf_preds)
rf_roc = roc_auc_score(y_test, rf_proba)

# Neural Network (MLP) without SMOTE
mlp_clf = MLPClassifier(random_state=42, max_iter=500)
mlp_clf.fit(X_train, y_train)
mlp_preds = mlp_clf.predict(X_test)
mlp_proba = mlp_clf.predict_proba(X_test)[:, 1]
mlp_f1 = f1_score(y_test, mlp_preds)
mlp_roc = roc_auc_score(y_test, mlp_proba)

# Print F1 and ROC AUC scores
print(f"Random Forest (SMOTE) - F1: {rf_f1:.3f}, ROC AUC: {rf_roc:.3f}")
print(f"Neural Network (no SMOTE) - F1: {mlp_f1:.3f}, ROC AUC: {mlp_roc:.3f}")

# Predict on candidates using Random Forest
if not candidates.empty:
    cand_pred_labels = rf_clf.predict(X_candidates_scaled)
    total = len(cand_pred_labels)
    num_exoplanet = (cand_pred_labels == 1).sum()
    num_false = (cand_pred_labels == 0).sum()
    print(f"Among {total} candidates: {num_exoplanet} predicted exoplanet ({num_exoplanet/total:.2%}), {num_false} predicted non-exoplanet ({num_false/total:.2%})")

    # Filter candidates predicted as exoplanets
    predicted_exoplanets = candidates[cand_pred_labels == 1].copy()

    # Define habitability check function
    def check_habitable(row):
        criteria = {
            'radius': 1 <= row['pl_rade'] <= 4 if not pd.isna(row['pl_rade']) else False,
            'mass': 1 <= row['pl_bmasse'] <= 15 if not pd.isna(row['pl_bmasse']) else False,
            'eq_temp': 200 <= row['pl_eqt'] <= 350 if not pd.isna(row['pl_eqt']) else False,
            'insolation': 0.1 <= row['pl_insol'] <= 3 if not pd.isna(row['pl_insol']) else False,
            'star_teff': 2600 <= row['st_teff'] <= 6500 if not pd.isna(row['st_teff']) else False,
            'eccentricity': row['pl_orbeccen'] < 0.2 if not pd.isna(row['pl_orbeccen']) else True
        }
        score = sum(criteria.values())
        return score / len(criteria)

    # Calculate habitability score for predicted exoplanets
    predicted_exoplanets['habitability_score'] = predicted_exoplanets.apply(check_habitable, axis=1)

    # Filter for promising liveable candidates (score > 0.5)
    liveable_candidates = predicted_exoplanets[predicted_exoplanets['habitability_score'] > 0.5]

    # Show top liveable candidates
    print("\nTop potentially liveable candidate exoplanets predicted by Random Forest:")
    print(liveable_candidates[['pl_name', 'pl_rade', 'pl_bmasse', 'pl_eqt', 'pl_insol', 'st_teff', 'pl_orbeccen', 'habitability_score']]
          .sort_values('habitability_score', ascending=False).head(20))

# Visualization
rf_fpr, rf_tpr, _ = roc_curve(y_test, rf_proba)
mlp_fpr, mlp_tpr, _ = roc_curve(y_test, mlp_proba)
plt.figure(figsize=(8,6))
plt.plot(rf_fpr, rf_tpr, label=f'Random Forest (AUC={rf_roc:.2f})')
plt.plot(mlp_fpr, mlp_tpr, label=f'Neural Network (AUC={mlp_roc:.2f})')
plt.plot([0,1],[0,1],'k--',label='Chance')
plt.xlabel("False Positive Rate")
plt.ylabel("True Positive Rate (Recall)")
plt.title("ROC Curve Comparison")
plt.legend()
plt.tight_layout()
plt.show()
