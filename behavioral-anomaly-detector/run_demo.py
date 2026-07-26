import subprocess
import time
import os
import signal
import sys

def main():
    print("Starting AI-Powered Behavioral Anomaly Detection Demo...")
    
    processes = []
    
    try:
        # 1. Ensure artifacts directory exists
        os.makedirs("data/generated", exist_ok=True)
        os.makedirs("models/artifacts", exist_ok=True)
        
        # 2. Build React Dashboard
        print("Building React Dashboard for production...")
        subprocess.run(["npm", "run", "build"], cwd="frontend", shell=True, check=True)
        
        # 3. Start API (which now serves the frontend)
        print("Starting FastAPI Backend (serving API and Frontend on port 8000)...")
        api_proc = subprocess.Popen([sys.executable, "-m", "uvicorn", "api.main:app", "--port", "8000"])
        processes.append(api_proc)
        
        print("\nAll systems running. Dashboard is available at http://localhost:8000")
        print("Press Ctrl+C to stop.")
        
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\nStopping demo...")
    finally:
        for p in processes:
            p.terminate()
            p.wait()
        print("Demo stopped.")

if __name__ == "__main__":
    main()
