from typing import Dict, Any, List

def generate_explanation(
    event: Dict[str, Any], 
    risk_score: float, 
    predicted_class: str, 
    attention_weights: List[float], 
    entity_history: List[Dict[str, Any]]
) -> str:
    """
    Explainability Layer: Generates a human-readable explanation for why an event was flagged
    using sequence attention weights. Meets Hackathon Deliverable 5.
    
    Args:
        event (Dict[str, Any]): The current access event payload.
        risk_score (float): The final ensemble risk score (0.0 to 1.0).
        predicted_class (str): The anomaly taxonomy category from the classifier head.
        attention_weights (List[float]): Temporal attention weights assigned by the GRU.
        entity_history (List[Dict[str, Any]]): The chronological window of prior events.
        
    Returns:
        str: A succinct, analyst-facing explanation string.
    """
    if risk_score < 0.5:
        return "Behavior is consistent with baseline profile."
        
    base = f"Flagged with {risk_score:.2f} risk due to {predicted_class.replace('_', ' ')}:"
    
    if len(entity_history) == 0:
        return f"{base} Cold-start entity with no prior behavioral history."
        
    if predicted_class == "brute_force":
        return f"{base} Rapid authentication failures originating from IP {event.get('source_ip')}."
    elif predicted_class == "impossible_travel":
        prev_loc = entity_history[-1].get('geo_location') if entity_history else "Unknown"
        return f"{base} Geo-velocity anomaly + travel from {prev_loc} to {event.get('geo_location')}."
    elif predicted_class == "credential_stuffing":
        return f"{base} Widespread credential failures observed from IP {event.get('source_ip')}."
    elif predicted_class == "lateral_movement":
        return f"{base} Atypical sequence + anomalous access to high-sensitivity resource {event.get('resource_accessed')}."
    elif predicted_class == "device_spoofing":
        return f"{base} New device fingerprint ({event.get('device_fingerprint')}) + deviates from historical baseline."
    elif predicted_class == "low_and_slow":
        return f"{base} Gradual access pattern accumulating over non-standard off-hours."
    elif predicted_class == "insider_drift":
        return f"{base} Edge-case footprint expansion + newly accessing {event.get('resource_accessed')}."
        
    return f"{base} Deviated from temporal baseline."

