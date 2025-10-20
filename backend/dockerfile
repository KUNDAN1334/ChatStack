# Use full Python image (includes OpenSSL + CA certs)
FROM python:3.11

WORKDIR /app

# Copy files
COPY . .

# Install system certificates and Python deps
RUN apt-get update && apt-get install -y ca-certificates && update-ca-certificates
RUN pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 8080

# Start your FastAPI app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
