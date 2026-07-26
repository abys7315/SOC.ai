import json
import os
import logging
from api.audit_logger import audit_logger

logger = logging.getLogger(__name__)

class ConfigManager:
    def __init__(self, config_path="data/settings.json"):
        self.config_path = config_path
        self._ensure_config_exists()

    def _ensure_config_exists(self):
        os.makedirs(os.path.dirname(self.config_path), exist_ok=True)
        if not os.path.exists(self.config_path):
            default_config = {
                "general": {
                    "platformName": "Behavioral Anomaly Detection Platform",
                    "language": "English (US)",
                    "timezone": "UTC",
                    "theme": "Dark"
                },
                "security": {
                    "mfa": True,
                    "sessionTimeout": "30",
                    "passwordPolicy": "Strict",
                    "autoBlockIp": True,
                    "maxFailedLogins": "5"
                },
                "ai": {
                    "activeModel": "Transformer (Multi-Head Attention)",
                    "retrainingInterval": "Weekly",
                    "anomalyThreshold": "0.75",
                    "maxFalsePositives": "2",
                    "autoUpdate": True
                }
            }
            self.save_config(default_config)

    def load_config(self):
        try:
            with open(self.config_path, "r") as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Failed to load config: {e}")
            return {}

    def save_config(self, config_data):
        try:
            # Merge with existing to avoid overwriting unrelated tabs if any
            existing = self.load_config() if os.path.exists(self.config_path) else {}
            # Deep merge dictionaries
            for k, v in config_data.items():
                if isinstance(v, dict) and k in existing and isinstance(existing[k], dict):
                    existing[k].update(v)
                else:
                    existing[k] = v
                    
            with open(self.config_path, "w") as f:
                json.dump(existing, f, indent=4)
                
            # Log the change
            audit_logger.log_event("CONFIG_UPDATE", "admin", config_data)
            return True
        except Exception as e:
            logger.error(f"Failed to save config: {e}")
            return False

config_manager = ConfigManager()
