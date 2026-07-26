import os
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
import pickle

# Important to allow imports when running locally vs Kaggle
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from models.classifier import AnomalyClassifier
except ImportError:
    from classifier import AnomalyClassifier

class AccessEventDataset(Dataset):
    def __init__(self, sequences, seq_lengths, labels):
        self.sequences = sequences
        self.seq_lengths = seq_lengths
        self.labels = labels

    def __len__(self):
        return len(self.sequences)

    def __getitem__(self, idx):
        cat_x, cont_x = self.sequences[idx]
        return (
            torch.tensor(cat_x, dtype=torch.long),
            torch.tensor(cont_x, dtype=torch.float32),
            torch.tensor(self.seq_lengths[idx], dtype=torch.long),
            torch.tensor(self.labels[idx], dtype=torch.long)
        )

def collate_fn(batch):
    cat_x, cont_x, seq_lengths, labels = zip(*batch)
    
    # Pad sequences
    cat_x_padded = torch.nn.utils.rnn.pad_sequence(cat_x, batch_first=True, padding_value=0)
    cont_x_padded = torch.nn.utils.rnn.pad_sequence(cont_x, batch_first=True, padding_value=0.0)
    
    seq_lengths = torch.stack(seq_lengths)
    labels = torch.stack(labels)
    
    return cat_x_padded, cont_x_padded, seq_lengths, labels

class DataPreprocessor:
    def __init__(self, max_seq_len=20):
        self.max_seq_len = max_seq_len
        self.cat_encoders = {}
        self.cont_scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        
        self.cat_cols = ['entity_type', 'source_ip', 'geo_location', 'resource_accessed', 'auth_method', 'device_fingerprint']
        self.cont_cols = ['session_duration']
        
    def fit(self, df):
        print("Fitting preprocessor...")
        for col in self.cat_cols:
            self.cat_encoders[col] = LabelEncoder()
            # Fit with a fallback for unseen values later
            self.cat_encoders[col].fit(df[col].astype(str).tolist() + ['<UNKNOWN>'])
            
        self.cont_scaler.fit(df[self.cont_cols])
        
        if 'label' in df.columns:
            # Force 'normal' to be class 0
            unique_labels = sorted(df['label'].unique().tolist())
            if 'normal' in unique_labels:
                unique_labels.remove('normal')
            unique_labels = ['normal'] + unique_labels
            self.label_encoder.fit(unique_labels)
            
    def transform_to_sequences(self, df, fit=False):
        if fit:
            self.fit(df)
            
        print("Transforming to sequences...")
        # Sort by entity and timestamp
        df = df.sort_values(by=['entity_id', 'timestamp'])
        
        # Transform categorical
        cat_data = {}
        for col in self.cat_cols:
            # Map unknown values to '<UNKNOWN>'
            known_classes = set(self.cat_encoders[col].classes_)
            encoded = df[col].astype(str).apply(lambda x: x if x in known_classes else '<UNKNOWN>')
            cat_data[col] = self.cat_encoders[col].transform(encoded)
            
        cont_data = self.cont_scaler.transform(df[self.cont_cols])
        
        sequences = []
        seq_lengths = []
        labels = []
        
        # Group by entity to form sequences
        grouped = df.groupby('entity_id')
        
        for entity_id, group in grouped:
            cat_matrix = np.stack([cat_data[col][group.index] for col in self.cat_cols], axis=1)
            cont_matrix = cont_data[group.index]
            
            group_labels = self.label_encoder.transform(group['label']) if 'label' in group.columns else np.zeros(len(group))
            
            # Sliding window to create sequences
            for i in range(len(group)):
                start_idx = max(0, i - self.max_seq_len + 1)
                seq_cat = cat_matrix[start_idx:i+1]
                seq_cont = cont_matrix[start_idx:i+1]
                
                sequences.append((seq_cat, seq_cont))
                seq_lengths.append(len(seq_cat))
                labels.append(group_labels[i])
                
        return sequences, seq_lengths, labels

def train_model(data_path="data/generated/synthetic_data.csv", output_dir="models/artifacts", epochs=3, batch_size=64):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")
    
    if not os.path.exists(data_path):
        print(f"Data not found at {data_path}")
        return
        
    df = pd.read_csv(data_path)
    
    preprocessor = DataPreprocessor()
    sequences, seq_lengths, labels = preprocessor.transform_to_sequences(df, fit=True)
    
    dataset = AccessEventDataset(sequences, seq_lengths, labels)
    dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True, collate_fn=collate_fn)
    
    num_classes = len(preprocessor.label_encoder.classes_)
    
    # Calculate class weights for imbalance
    label_counts = np.bincount(labels)
    total_samples = len(labels)
    # class_weights = total_samples / (num_classes * label_counts + 1e-6)
    # Give high weight to anomalies, low to normal
    class_weights = np.ones(num_classes)
    class_weights[0] = 0.1 # Normal
    for i in range(1, num_classes):
        class_weights[i] = 10.0 # Anomalies
    
    class_weights_tensor = torch.tensor(class_weights, dtype=torch.float32).to(device)
    
    model = AnomalyClassifier(num_classes=num_classes).to(device)
    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3)
    criterion = nn.CrossEntropyLoss(weight=class_weights_tensor)
    
    os.makedirs(output_dir, exist_ok=True)
    
    for epoch in range(epochs):
        model.train()
        total_loss = 0
        for batch_idx, (cat_x, cont_x, seq_len, y) in enumerate(dataloader):
            cat_x, cont_x, seq_len, y = cat_x.to(device), cont_x.to(device), seq_len.to(device), y.to(device)
            
            optimizer.zero_grad()
            logits, attn = model(cat_x, cont_x, seq_len)
            
            # Predict only for the last event in the sequence
            # (which is the current event we are evaluating)
            # The GRU processes the sequence and outputs context for the end of the sequence.
            loss = criterion(logits, y)
            
            loss.backward()
            optimizer.step()
            
            total_loss += loss.item()
            
            if batch_idx % 100 == 0:
                print(f"Epoch {epoch+1}/{epochs}, Batch {batch_idx}, Loss: {loss.item():.4f}")
                
        print(f"Epoch {epoch+1} Avg Loss: {total_loss/len(dataloader):.4f}")
        
        # Save checkpoint
        torch.save(model.state_dict(), os.path.join(output_dir, f"model_ep{epoch+1}.pt"))
        
    # Save final artifacts
    torch.save(model.state_dict(), os.path.join(output_dir, "model_final.pt"))
    with open(os.path.join(output_dir, "preprocessor.pkl"), 'wb') as f:
        pickle.dump(preprocessor, f)
        
    print("Training complete. Artifacts saved.")

if __name__ == "__main__":
    train_model(epochs=5) # Local training to make demo robust
