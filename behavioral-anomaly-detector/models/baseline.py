import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import pickle

class BaselineDetector:
    def __init__(self):
        self.numeric_features = ['session_duration']
        self.categorical_features = ['entity_type', 'auth_method']
        
        self.preprocessor = ColumnTransformer(
            transformers=[
                ('num', StandardScaler(), self.numeric_features),
                ('cat', OneHotEncoder(handle_unknown='ignore'), self.categorical_features)
            ])
            
        self.model = IsolationForest(contamination=0.02, random_state=42)
        self.pipeline = Pipeline(steps=[('preprocessor', self.preprocessor),
                                        ('classifier', self.model)])
        self.is_trained = False

    def train(self, df: pd.DataFrame):
        print(f"Training Baseline Isolation Forest on {len(df)} samples...")
        self.pipeline.fit(df)
        self.is_trained = True
        print("Training complete.")

    def predict(self, df: pd.DataFrame):
        if not self.is_trained:
            raise ValueError("Model is not trained yet.")
        
        # Returns -1 for outliers and 1 for inliers.
        preds = self.pipeline.predict(df)
        # Convert to risk score: Decision function is lower for anomalies.
        # We want risk score (0-1) where 1 is highly anomalous.
        scores = self.pipeline.decision_function(df)
        # Normalize roughly between 0 and 1 (lower decision function = higher risk)
        max_score = scores.max()
        min_score = scores.min()
        
        risk_scores = 1 - ((scores - min_score) / (max_score - min_score + 1e-6))
        return risk_scores

    def save(self, path="models/artifacts/baseline.pkl"):
        with open(path, 'wb') as f:
            pickle.dump(self.pipeline, f)
            
    def load(self, path="models/artifacts/baseline.pkl"):
        with open(path, 'rb') as f:
            self.pipeline = pickle.load(f)
        self.is_trained = True

if __name__ == "__main__":
    import os
    data_path = "data/generated/synthetic_data.csv"
    if not os.path.exists(data_path):
        print("No synthetic data found. Run data/generator.py first.")
    else:
        df = pd.read_csv(data_path)
        detector = BaselineDetector()
        # Train on mostly normal data (assume we have labels and filter, or just unsupervised)
        # Isolation forest can handle contamination
        detector.train(df)
        
        scores = detector.predict(df)
        df['risk_score'] = scores
        df['predicted_anomaly'] = df['risk_score'] > 0.8
        
        if 'label' in df.columns:
            true_anomalies = df['label'] != 'normal'
            predicted_anomalies = df['predicted_anomaly']
            
            from sklearn.metrics import classification_report, precision_recall_fscore_support
            print("Baseline Evaluation:")
            print(classification_report(true_anomalies, predicted_anomalies, target_names=["Normal", "Anomaly"]))
            
        os.makedirs("models/artifacts", exist_ok=True)
        detector.save()
