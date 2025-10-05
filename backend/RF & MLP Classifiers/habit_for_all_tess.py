import pandas as pd

# Load your TESS dataset
df = pd.read_csv('data/tess.csv')

# Only use confirmed exoplanets (tfopwg_disp = 'CP')
confirmed = df[df['tfopwg_disp'] == 'CP'].copy()

# Define updated habitability criteria based on recent research
def check_habitable(row):
    criteria = {
        'radius': 0.5 <= row['pl_rade'] <= 1.8 if not pd.isna(row['pl_rade']) else False,
        'mass': 1 <= row['pl_bmasse'] <= 15 if 'pl_bmasse' in row and not pd.isna(row.get('pl_bmasse', pd.NA)) else True,
        'insolation': 0.2 <= row['pl_insol'] <= 2 if not pd.isna(row['pl_insol']) else False,
        'eq_temp': 175 <= row['pl_eqt'] <= 300 if not pd.isna(row['pl_eqt']) else False,
        'eccentricity': row['pl_orbeccen'] < 0.2 if 'pl_orbeccen' in row and not pd.isna(row.get('pl_orbeccen', pd.NA)) else True,
        'star_teff': 2700 <= row['st_teff'] <= 6000 if not pd.isna(row['st_teff']) else False,
        'star_rad': 0.1 <= row['st_rad'] <= 1.5 if not pd.isna(row['st_rad']) else False,
    }
    score = sum(criteria.values())
    return score / len(criteria)

# Calculate habitability score for confirmed TESS exoplanets
confirmed['habitability_score'] = confirmed.apply(check_habitable, axis=1)

# Select potentially habitable confirmed exoplanets with score > 0.5
liveable = confirmed[confirmed['habitability_score'] > 0.5].copy()

# Columns to display (include if present)
cols_to_show = ['toi', 'pl_rade', 'pl_bmasse', 'pl_eqt', 'pl_insol', 'pl_orbeccen', 'st_teff', 'st_rad', 'habitability_score']
liveable_cols = [col for col in cols_to_show if col in liveable.columns]

# Display top candidates sorted by habitability score
print(liveable[liveable_cols].sort_values('habitability_score', ascending=False).head(20))
