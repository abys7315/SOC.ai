import os
import torch
import pickle
import pandas as pd
import numpy as np

try:
    from models.classifier import AnomalyClassifier
    from models.train import DataPreprocessor
except ImportError:
    from classifier import AnomalyClassifier
    from train import DataPreprocessor

class InferenceModel:
    def __init__(self, model_dir="models/artifacts"):
        self.model_dir = model_dir
        self.device = torch.device('cpu') # Always CPU for local inference
        self.preprocessor = None
        self.model = None
        self.is_loaded = False
        self.entity_history = {} # Stores recent events per entity to construct sequences
        self.max_seq_len = 20
        
    def load(self):
        prep_path = os.path.join(self.model_dir, "preprocessor.pkl")
        model_path = os.path.join(self.model_dir, "model_final.pt")
        
        if not os.path.exists(prep_path) or not os.path.exists(model_path):
            print(f"Artifacts not found in {self.model_dir}. Please train first.")
            return False
            
        import __main__
        __main__.DataPreprocessor = DataPreprocessor
        
        with open(prep_path, 'rb') as f:
            self.preprocessor = pickle.load(f)
            
        num_classes = len(self.preprocessor.label_encoder.classes_)
        self.model = AnomalyClassifier(num_classes=num_classes)
        self.model.load_state_dict(torch.load(model_path, map_location=self.device))
        self.model.eval()
        self.is_loaded = True
        return True

    def predict_event(self, event_dict):
        """
        Predicts anomaly for a single incoming event dictionary.
        Maintains internal sequence state per entity.
        """
        if not self.is_loaded:
            raise ValueError("Model not loaded.")
            
        entity_id = event_dict.get('entity_id')
        
        # Cold start fallback if entity has no history
        is_cold_start = entity_id not in self.entity_history
        
        if is_cold_start:
            self.entity_history[entity_id] = []
            
        # Add to history
        self.entity_history[entity_id].append(event_dict)
        
        # Truncate history
        if len(self.entity_history[entity_id]) > self.max_seq_len:
            self.entity_history[entity_id].pop(0)
            
        # Create sequence dataframe
        seq_df = pd.DataFrame(self.entity_history[entity_id])
        
        # Transform (without fitting)
        cat_data = {}
        for col in self.preprocessor.cat_cols:
            known_classes = set(self.preprocessor.cat_encoders[col].classes_)
            encoded = seq_df[col].astype(str).apply(lambda x: x if x in known_classes else '<UNKNOWN>')
            cat_data[col] = self.preprocessor.cat_encoders[col].transform(encoded)
            
        cont_data = self.preprocessor.cont_scaler.transform(seq_df[self.preprocessor.cont_cols])
        
        seq_cat = np.stack([cat_data[col] for col in self.preprocessor.cat_cols], axis=1)
        seq_cont = cont_data
        
        cat_t = torch.tensor(seq_cat, dtype=torch.long).unsqueeze(0).to(self.device)
        cont_t = torch.tensor(seq_cont, dtype=torch.float32).unsqueeze(0).to(self.device)
        seq_len = torch.tensor([len(seq_cat)], dtype=torch.long).to(self.device)
        
        with torch.no_grad():
            logits, attn = self.model(cat_t, cont_t, seq_len)
            probs = torch.softmax(logits, dim=-1).squeeze(0)
            
            # Dynamically find the index for 'normal'
            classes = list(self.preprocessor.label_encoder.classes_)
            normal_idx = classes.index('normal') if 'normal' in classes else 0
            risk_score = 1.0 - probs[normal_idx].item()
            
            pred_class_idx = torch.argmax(probs).item()
            pred_class_name = self.preprocessor.label_encoder.inverse_transform([pred_class_idx])[0]
            
            # Penalize cold-start confidence
            if is_cold_start:
                risk_score = min(0.3, risk_score) # Cap risk score for unknown entities until history builds
                
        return {
            'risk_score': risk_score,
            'predicted_class': pred_class_name,
            'is_cold_start': is_cold_start,
            'attention_weights': attn.squeeze(0).tolist()
        }
