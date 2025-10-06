# NASA Hackathon Project Proposal

## Summary

We developed unsupervised AI models—including Random Forest Classifier, MLP, and Bayesian modeling with TRICERATOPS—trained and tested on NASA K2 and TESS datasets. Our system predicts whether candidates are true exoplanets or false positives using RFC and MLP. TRICERATOPS, a proven astronomical Bayesian tool, validates our AI predictions. Additionally, our AI estimates the potential habitability of predicted exoplanets.

---

## How to Run the Backend

Navigate to the appropriate directory and run any Python file via terminal or Visual Studio Code:

python <filename>.py
---

## k2_predict.py Overview

This script processes the K2 dataset to classify exoplanet candidates:

- Loads and preprocesses data, encoding confirmed planets and false positives.
- Selects numeric features, handles missing values.
- Splits data into training and testing sets.
- Trains a Random Forest Classifier with SMOTE to handle class imbalance.
- Trains a Neural Network (MLP) without SMOTE.
- **Achieves 99% accuracy for both Random Forest and MLP models.**
- Evaluates models using F1 and ROC AUC scores.
- Predicts on unlabeled candidates, outputs counts of predicted exoplanets and false positives.
- Filters predicted exoplanets with complete stellar data and saves them to `exoplanets_to_confirm.csv`.
- Calculates habitability scores for predicted exoplanets and lists top candidates.
- Visualizes feature importance and ROC curves.

---

## tess_predict.py Overview

`tess_predict.py` works exactly like `k2_predict.py`, but uses the TESS dataset as input.

- Loads and preprocesses TESS data, encoding confirmed planets and false positives.
- Selects relevant numeric features, handles missing values, and scales the data.
- Splits the data into training and testing sets.
- Trains a Random Forest Classifier (with SMOTE for class balance) and a Neural Network (MLP).
- **Achieves 91% accuracy for both Random Forest and MLP models (limited by available data).**
- Evaluates both models using F1 and ROC AUC scores, reporting high accuracy and robust classification.
- Predicts on unlabeled TESS candidates, outputs the number of likely exoplanets and false positives.
- Filters and saves all predicted exoplanets with complete stellar data to `exoplanets_to_confirm.csv`.
- Calculates habitability scores for predicted exoplanets and lists the most promising candidates.
- Visualizes feature importance and ROC curves for model performance.


--

## habit_for_all_k2.py and habit_for_all_tess.py

These scripts demonstrate that the AI models correctly identify known habitable exoplanets.

- They load the K2 or TESS dataset and select only confirmed exoplanets.
- Each confirmed planet is scored for habitability using physical and stellar criteria (radius, mass, temperature, insolation, etc.).
- The scripts output a ranked list of the most promising habitable exoplanets, showing that the model's predictions align with established scientific knowledge.

---

**In summary:**  
Both `k2_predict.py` and `tess_predict.py` provide high-accuracy exoplanet classification and habitability assessment, validated against real NASA datasets and known habitable worlds.


## Next Steps and Integration

The `exoplanets_to_confirm.csv` file, produced by our pipeline, can be directly used as input for validation with the TRICERATOPS algorithm.  
To perform this step, simply navigate to the TRICERATOPS directory and follow the instructions in its `README.md` to validate the list of predicted exoplanets.

---

## Areas for Improvement (AFI)

- **Automated Integration:**  
  Link the ML prediction pipeline and TRICERATOPS validation into a single automated workflow, where the output of one feeds directly into the next step.

- **Broader Training Data:**  
  Incorporate more exoplanet datasets to increase robustness and improve model generalization.

- **Explore Additional Models:**  
  Experiment with more advanced machine learning models (e.g., gradient boosting, deep learning architectures) for improved accuracy and reliability.

---

## Notice on the Use of Artificial Intelligence (AI)

This project leverages artificial intelligence (AI) and machine learning to analyze large astronomical datasets, identify exoplanet candidates, and assess their habitability.  
AI models are trained and validated using publicly available NASA data, and all results are subject to further scientific review and validation.

We follow NASA's ethical guidelines for responsible AI use, including transparency, reproducibility, and careful handling of biases in training data.  
Human oversight and expert validation remain essential to ensure the reliability and integrity of AI-driven discoveries.

---
