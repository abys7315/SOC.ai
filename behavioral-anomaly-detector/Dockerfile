# Final stage for FastAPI backend
FROM python:3.10-slim
WORKDIR /app

# Install system dependencies if needed
RUN apt-get update && apt-get install -y build-essential

# Install dependencies (CPU version of torch to save RAM and space)
COPY requirements.txt .
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY . .

# Expose port
EXPOSE 8000

# Run the FastAPI server
CMD ["python", "-m", "uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
