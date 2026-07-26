import numpy as np
from sklearn.metrics import precision_recall_fscore_support, roc_auc_score

def evaluate_at_budget(y_true, y_scores, budget_percentile=1.0):
    """
    Evaluates performance assuming an analyst can only investigate 
    the top X% of events (alert budget).
    """
    # Find the threshold for the top X%
    threshold = np.percentile(y_scores, 100 - budget_percentile)
    
    y_pred = (y_scores >= threshold).astype(int)
    
    precision, recall, f1, _ = precision_recall_fscore_support(y_true, y_pred, average='binary')
    
    # False Positive Rate
    fp = np.sum((y_pred == 1) & (y_true == 0))
    tn = np.sum((y_pred == 0) & (y_true == 0))
    fpr = fp / (fp + tn + 1e-6)
    
    try:
        auc = roc_auc_score(y_true, y_scores)
    except:
        auc = 0.0
        
    return {
        "budget_percent": budget_percentile,
        "threshold": threshold,
        "precision": precision,
        "recall": recall,
        "f1": f1,
        "fpr": fpr,
        "auc": auc
    }
