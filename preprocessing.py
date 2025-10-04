import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import SMOTE
import matplotlib.pyplot as plt
from sklearn.metrics import accuracy_score

# Function to print ratio of 0 to 1 in target array
def print_ratio(y, label):
    count_0 = sum(y == 0)
    count_1 = sum(y == 1)
    if count_1 > 0:
        ratio = count_0 / count_1
    else:
        ratio = float('inf')
    print(f"{label} - Count of 0: {count_0}, Count of 1: {count_1}, Ratio 0 to 1: {ratio:.2f}")

# Load your dataset
df = pd.read_csv('data/k2.csv')

# Encode disposition
def encode_disposition(x):
    if x == "CONFIRMED":
        return 1
    elif x in ["FALSE POSITIVE", "REFUTED"]:
        return 0
    else: # 'CANDIDATE'
        return -1

df['target'] = df['disposition'].apply(encode_disposition)

# Separate fully labeled and candidate (unknown) data
labeled = df[df['target'] != -1]
candidates = df[df['target'] == -1]

# Columns to ignore
ignore = [
    'disposition', 'target', 'pl_name', 'kepid', 'kepoi_name', 'kepler_name', 'hostname', 'toi', 'tid',
    'sy_pnum', 'default_flag', 'disp_refname', 'pl_refname', 'st_refname', 'sy_refname', 'pl_bmassprov',
    'rastr', 'decstr', 'rowupdate', 'pl_pubdate', 'releasedate', 'soltype', 'pl_controv_flag', 'ttv_flag',
    'sy_snum', 'discoverymethod', 'disc_facility', 'st_spectype'
]
ignore += [col for col in df.columns if col.endswith('lim') or col.endswith('refname')]

features = [c for c in df.columns if c not in ignore and pd.api.types.is_numeric_dtype(df[c])]

# Fill missing values with median
X_labeled = labeled[features].fillna(labeled[features].median())
X_candidates = candidates[features].fillna(labeled[features].median())
y = labeled['target']

# Normalize
scaler = StandardScaler()
X_labeled_scaled = scaler.fit_transform(X_labeled)
X_candidates_scaled = scaler.transform(X_candidates)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X_labeled_scaled, y, test_size=0.2, stratify=y, random_state=42)

# Before SMOTE
print_ratio(y_train, "Before SMOTE")

# Apply SMOTE to training data only
smote = SMOTE(random_state=42)
X_train_smote, y_train_smote = smote.fit_resample(X_train, y_train)

# After SMOTE
print_ratio(y_train_smote, "After SMOTE")

# Train Random Forest
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train_smote, y_train_smote)

# Feature importance
importances = pd.Series(clf.feature_importances_, index=features).sort_values(ascending=False)
top_n = 30

importances.head(top_n).plot(kind='barh')
plt.title("Top Feature Importances")
plt.xlabel("Relative Importance")
plt.gca().invert_yaxis()
plt.tight_layout()
plt.show()

# Predict on candidates
if not candidates.empty:
    cand_probs = clf.predict_proba(X_candidates_scaled)[:,1]
    candidates['prob_exoplanet'] = cand_probs
    print(candidates[['pl_name', 'prob_exoplanet']].head())

# Evaluate on test set
test_preds = clf.predict_proba(X_test)[:,1]
print("First 10 predictions on test set:", test_preds[:10])

# For labeled test set
test_pred_labels = clf.predict(X_test)
accuracy = accuracy_score(y_test, test_pred_labels)
print("Accuracy on 10% labeled test set:", accuracy)

# For CANDIDATES: 
# (Since true labels for candidates are unknown, show proportion predicted as exoplanet/non-exoplanet)
if not candidates.empty:
    cand_pred_labels = clf.predict(X_candidates_scaled)
    total = len(cand_pred_labels)
    num_exoplanet = (cand_pred_labels == 1).sum()
    num_false = (cand_pred_labels == 0).sum()
    print(f"Among {total} candidates: {num_exoplanet} predicted exoplanet ({num_exoplanet/total:.2%}), {num_false} predicted non-exoplanet ({num_false/total:.2%})")
