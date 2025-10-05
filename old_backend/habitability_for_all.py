import pandas as pd

# Load your dataset
df = pd.read_csv('data/k2.csv')

# Only use confirmed exoplanets
confirmed = df[df['disposition'] == 'CONFIRMED']

# Define habitability criteria
def check_habitable(row):
    criteria = {
        'radius': 1 <= row['pl_rade'] <= 4 if not pd.isna(row['pl_rade']) else False,
        'mass': 1 <= row['pl_bmasse'] <= 15 if not pd.isna(row['pl_bmasse']) else False,
        'eq_temp': 200 <= row['pl_eqt'] <= 350 if not pd.isna(row['pl_eqt']) else False,
        'insolation': 0.1 <= row['pl_insol'] <= 3 if not pd.isna(row['pl_insol']) else False,
        'star_teff': 2600 <= row['st_teff'] <= 6500 if not pd.isna(row['st_teff']) else False,
        'eccentricity': row['pl_orbeccen'] < 0.2 if not pd.isna(row['pl_orbeccen']) else True # don't penalize missing values
    }
    score = sum(criteria.values())
    return score / len(criteria)  # fraction of criteria satisfied

# Calculate habitability score ("chance")
confirmed['habitability_score'] = confirmed.apply(check_habitable, axis=1)

# Display the most promising liveable planet candidates
liveable = confirmed[confirmed['habitability_score'] > 0.5].copy()  # at least half conditions met

# Show top candidates with their scores
print(liveable[['pl_name', 'pl_rade', 'pl_bmasse', 'pl_eqt', 'pl_insol', 'st_teff', 'pl_orbeccen', 'habitability_score']].sort_values('habitability_score', ascending=False).head(20))
