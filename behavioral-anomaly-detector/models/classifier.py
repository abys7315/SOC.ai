import torch
import torch.nn as nn
from models.sequence_encoder import SequenceEncoder

class AnomalyClassifier(nn.Module):
    """
    Combines the sequence encoder with a classification head.
    Predicts normal vs anomaly types.
    """
    def __init__(self, num_classes=8, hidden_dim=64):
        super().__init__()
        self.encoder = SequenceEncoder(hidden_dim=hidden_dim)
        
        self.classifier = nn.Sequential(
            nn.Linear(hidden_dim, 32),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(32, num_classes)
        )
        
    def forward(self, categorical_x, continuous_x, seq_lengths):
        context, attn_weights = self.encoder(categorical_x, continuous_x, seq_lengths)
        logits = self.classifier(context)
        return logits, attn_weights

    def get_risk_score(self, logits):
        """
        Calculates a risk score (0-1) where 0 is purely normal, and 1 is highly anomalous.
        Assuming class 0 is "normal" and others are anomalies.
        """
        probs = torch.softmax(logits, dim=-1)
        # Risk score is the probability of NOT being normal
        risk_score = 1.0 - probs[:, 0]
        return risk_score
