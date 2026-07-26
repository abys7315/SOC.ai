from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class AccessEvent(BaseModel):
    entity_id: str
    entity_type: str  # 'user', 'service_account', 'edge_device'
    timestamp: datetime
    source_ip: str
    geo_location: str
    resource_accessed: str
    auth_method: str
    session_duration: float
    command_sequence: List[str]
    device_fingerprint: str
    label: Optional[str] = "normal"  # normal or anomaly_type, hidden at inference
