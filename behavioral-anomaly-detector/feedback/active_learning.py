class FeedbackMemory:
    """
    Lightweight online recalibration memory buffer.
    Adjusts confidence scores based on analyst feedback.
    """
    def __init__(self):
        # Maps entity_id -> { 'anomaly_type': adjustment_factor }
        self.entity_adjustments = {}
        # Global adjustments
        self.global_adjustments = {}
        
    def add_feedback(self, entity_id, anomaly_type, is_accepted):
        """
        is_accepted: True if analyst confirmed it's an anomaly (True Positive)
                     False if analyst rejected it (False Positive)
        """
        if entity_id not in self.entity_adjustments:
            self.entity_adjustments[entity_id] = {}
            
        current = self.entity_adjustments[entity_id].get(anomaly_type, 0.0)
        
        if is_accepted:
            # Increase confidence for this pattern for this entity
            self.entity_adjustments[entity_id][anomaly_type] = min(0.5, current + 0.1)
        else:
            # Decrease confidence (e.g., this is normal behavior for this entity now)
            self.entity_adjustments[entity_id][anomaly_type] = max(-0.5, current - 0.2)
            
    def get_adjustment(self, entity_id, anomaly_type):
        if entity_id in self.entity_adjustments:
            return self.entity_adjustments[entity_id].get(anomaly_type, 0.0)
        return 0.0
