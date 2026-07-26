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
        
        # 2. Start API
        print("Starting FastAPI Backend...")
        api_proc = subprocess.Popen([sys.executable, "-m", "uvicorn", "api.main:app", "--port", "8000"])
        processes.append(api_proc)
        time.sleep(3) # Wait for API to boot
        
        # 3. (Removed) Data Generator is now controlled via the Data Generator UI
        
        # 4. Start React Dashboard
        print("Starting React Dashboard (Vite)...")
        dash_proc = subprocess.Popen(["npm", "run", "dev"], cwd="frontend", shell=True)
        processes.append(dash_proc)
        
        print("\nAll systems running. Press Ctrl+C to stop.")
        
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
