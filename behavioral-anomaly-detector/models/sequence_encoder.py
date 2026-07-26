import torch
import torch.nn as nn
from typing import Tuple

class EventEncoder(nn.Module):
    """
    Encodes individual access events into a dense vector by embedding categorical 
    and continuous features independently.
    """
    def __init__(self, num_categorical_features: int, embedding_dim: int = 16, num_continuous_features: int = 1) -> None:
        super().__init__()
        # Simplified embedding: hash trick or predefined vocab size for each categorical feature
        self.embeddings = nn.ModuleList([
            nn.Embedding(num_embeddings=1000, embedding_dim=embedding_dim) 
            for _ in range(num_categorical_features)
        ])
        
        self.continuous_layer = nn.Linear(num_continuous_features, embedding_dim)
        
        # Combine all categorical embeddings + 1 continuous embedding
        total_dim = (num_categorical_features * embedding_dim) + embedding_dim
        self.fc = nn.Sequential(
            nn.Linear(total_dim, 64),
            nn.ReLU(),
            nn.Dropout(0.2)
        )
        
    def forward(self, categorical_x: torch.Tensor, continuous_x: torch.Tensor) -> torch.Tensor:
        # categorical_x: [batch, seq_len, num_features]
        # continuous_x: [batch, seq_len, num_continuous_features]
        
        batch_size, seq_len, num_cat = categorical_x.shape
        embedded = []
        for i in range(num_cat):
            emb = self.embeddings[i](categorical_x[:, :, i]) # [batch, seq_len, emb_dim]
            embedded.append(emb)
            
        cont_emb = self.continuous_layer(continuous_x) # [batch, seq_len, emb_dim]
        embedded.append(cont_emb)
        
        x = torch.cat(embedded, dim=-1) # [batch, seq_len, total_dim]
        return self.fc(x) # [batch, seq_len, 64]

class SequenceEncoder(nn.Module):
    """
    Encodes a sequence of events for a single entity using a Gated Recurrent Unit (GRU).
    Incorporates an attention mechanism to assign importance weights to specific events.
    """
    def __init__(self, num_categorical: int = 6, hidden_dim: int = 64) -> None:
        super().__init__()
        self.event_encoder = EventEncoder(num_categorical_features=num_categorical)
        
        # We use a GRU for sequence modeling
        self.gru = nn.GRU(
            input_size=64, 
            hidden_size=hidden_dim, 
            num_layers=2, 
            batch_first=True, 
            dropout=0.2
        )
        
        # Attention layer for explainability
        self.attention_weights = nn.Linear(hidden_dim, 1)

    def forward(self, categorical_x: torch.Tensor, continuous_x: torch.Tensor, seq_lengths: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
        # x shape: [batch, seq_len, features]
        encoded_events = self.event_encoder(categorical_x, continuous_x) # [batch, seq_len, 64]
        
        # Pack sequence to handle variable lengths efficiently
        packed_input = nn.utils.rnn.pack_padded_sequence(
            encoded_events, seq_lengths.cpu(), batch_first=True, enforce_sorted=False
        )
        
        packed_output, hidden = self.gru(packed_input)
        
        output, _ = nn.utils.rnn.pad_packed_sequence(packed_output, batch_first=True) # [batch, seq_len, hidden_dim]
        
        # Calculate attention over the sequence
        attn_scores = self.attention_weights(output) # [batch, seq_len, 1]
        
        # Mask out padded positions
        mask = torch.arange(output.size(1), device=output.device)[None, :] < seq_lengths[:, None]
        attn_scores = attn_scores.squeeze(-1)
        attn_scores[~mask] = -1e9
        
        attn_weights = torch.softmax(attn_scores, dim=-1) # [batch, seq_len]
        
        # Context vector
        context = torch.bmm(attn_weights.unsqueeze(1), output).squeeze(1) # [batch, hidden_dim]
        
        return context, attn_weights
