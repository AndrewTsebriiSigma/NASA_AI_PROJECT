import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import SMOTE
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import f1_score, roc_auc_score, roc_curve
from warnings import filterwarnings
import matplotlib.pyplot as plt

filterwarnings('ignore')

# Load and preprocess data
df = pd.read_csv('data/tess.csv')

def encode_disposition(x):
    if x == "CP":
        return 1
    elif x in ["FP", "AFP"]:
        return 0
    else:
        return -1

df['target'] = df['tfopwg_disp'].apply(encode_disposition)
labeled = df[df['target'] != -1].copy()
candidates = df[df['target'] == -1].copy()

# Exclude unwanted columns including 'target'
ignore = ['toi', 'tid', 'tfopwg_disp', 'toi_created', 'rowupdate', 'rastr', 'decstr', 'ra', 'dec', 'target']
ignore += [col for col in df.columns if col.endswith('err1') or col.endswith('err2') or col.endswith('lim')]

features = [c for c in df.columns if c not in ignore and pd.api.types.is_numeric_dtype(df[c])]

# Prepare feature data
X_labeled = labeled[features].copy()
y = labeled['target'].copy()
X_candidates = candidates[features].copy()

# Replace zeros with NaN (treat zeros as missing)
X_labeled.replace(0, pd.NA, inplace=True)
X_candidates.replace(0, pd.NA, inplace=True)

# Drop rows with any missing values (NaN) in labeled data, align y accordingly
X_labeled.dropna(inplace=True)
y = y.loc[X_labeled.index]

# Drop rows with any missing values in candidates, align candidates dataframe accordingly
X_candidates.dropna(inplace=True)
candidates = candidates.loc[X_candidates.index]

# Scale features
scaler = StandardScaler()
X_labeled_scaled = scaler.fit_transform(X_labeled)
X_candidates_scaled = scaler.transform(X_candidates)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X_labeled_scaled, y, test_size=0.2, stratify=y, random_state=42
)

# Random Forest with SMOTE
smote = SMOTE(random_state=42)
X_train_smote, y_train_smote = smote.fit_resample(X_train, y_train)
rf_clf = RandomForestClassifier(n_estimators=100, random_state=42)
rf_clf.fit(X_train_smote, y_train_smote)
rf_preds = rf_clf.predict(X_test)
rf_proba = rf_clf.predict_proba(X_test)[:, 1]
rf_f1 = f1_score(y_test, rf_preds)
rf_roc = roc_auc_score(y_test, rf_proba)

# Visualize top features from Random Forest
importances = rf_clf.feature_importances_
feature_names = X_labeled.columns
indices = importances.argsort()[::-1][:30]

plt.figure(figsize=(8,6))
plt.barh(range(len(indices)), importances[indices][::-1])
plt.yticks(range(len(indices)), [feature_names[i] for i in indices][::-1])
plt.xlabel("Feature Importance")
plt.title("Top 30 Feature Importances (Random Forest)")
plt.tight_layout()
plt.show()

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

    predicted_exoplanets = candidates[cand_pred_labels == 1].copy()

    def check_habitable(row):
        criteria = {
            'radius': 0.5 <= row['pl_rade'] <= 1.8 if not pd.isna(row['pl_rade']) else False,
            'mass': 1 <= row['pl_bmasse'] <= 15 if 'pl_bmasse' in row and not pd.isna(row.get('pl_bmasse', pd.NA)) else False,
            'insolation': 0.2 <= row['pl_insol'] <= 2 if not pd.isna(row['pl_insol']) else False,
            'eq_temp': 175 <= row['pl_eqt'] <= 300 if not pd.isna(row['pl_eqt']) else False,
            'eccentricity': row['pl_orbeccen'] < 0.2 if 'pl_orbeccen' in row and not pd.isna(row.get('pl_orbeccen', pd.NA)) else False,
            'star_teff': 2700 <= row['st_teff'] <= 6000 if not pd.isna(row['st_teff']) else False,
            'star_rad': 0.1 <= row['st_rad'] <= 1.5 if not pd.isna(row['st_rad']) else False,
        }
        score = sum(criteria.values())
        return score / len(criteria)

    predicted_exoplanets['habitability_score'] = predicted_exoplanets.apply(check_habitable, axis=1)
    liveable_candidates = predicted_exoplanets[predicted_exoplanets['habitability_score'] > 0.5]

    print("\nTop potentially liveable candidate exoplanets predicted by Random Forest:")
    print(liveable_candidates[['toi', 'pl_rade', 'pl_eqt', 'pl_insol', 'st_teff', 'habitability_score']]
          .sort_values('habitability_score', ascending=False).head(20))

# Visualization: ROC curve comparison
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