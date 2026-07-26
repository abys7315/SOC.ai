import json
import os
import datetime
import uuid
import logging

logger = logging.getLogger(__name__)

class AuditLogger:
    def __init__(self, log_path="data/audit_log.json"):
        self.log_path = log_path
        self._ensure_exists()

    def _ensure_exists(self):
        os.makedirs(os.path.dirname(self.log_path), exist_ok=True)
        if not os.path.exists(self.log_path):
            with open(self.log_path, "w") as f:
                json.dump([], f)

    def log_event(self, action, user="admin", details=None):
        try:
            with open(self.log_path, "r") as f:
                logs = json.load(f)
            
            entry = {
                "id": str(uuid.uuid4()),
                "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
                "action": action,
                "user": user,
                "details": details or {}
            }
            logs.insert(0, entry) # Prepend newest
            
            # Keep max 500 logs for demo
            if len(logs) > 500:
                logs = logs[:500]
                
            with open(self.log_path, "w") as f:
                json.dump(logs, f, indent=4)
        except Exception as e:
            logger.error(f"Failed to write audit log: {e}")

    def get_logs(self, limit=100):
        try:
            with open(self.log_path, "r") as f:
                logs = json.load(f)
            return logs[:limit]
        except Exception:
            return []

audit_logger = AuditLogger()
