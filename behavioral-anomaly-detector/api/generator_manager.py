import subprocess
import sys
import logging

logger = logging.getLogger(__name__)

class GeneratorManager:
    def __init__(self):
        self.process = None

    def start(self):
        if self.is_running():
            return {"status": "already_running"}
        
        try:
            # We assume it's launched from the root directory of the project
            self.process = subprocess.Popen(
                [sys.executable, "data/generator.py", "--stream"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            logger.info("Data generator started.")
            return {"status": "started"}
        except Exception as e:
            logger.error(f"Failed to start generator: {e}")
            return {"status": "error", "message": str(e)}

    def stop(self):
        if not self.is_running():
            return {"status": "already_stopped"}
        
        try:
            self.process.terminate()
            self.process.wait(timeout=3)
            self.process = None
            logger.info("Data generator stopped.")
            return {"status": "stopped"}
        except Exception as e:
            logger.error(f"Failed to stop generator: {e}")
            return {"status": "error", "message": str(e)}

    def is_running(self):
        if self.process is None:
            return False
        return self.process.poll() is None

generator_manager = GeneratorManager()
