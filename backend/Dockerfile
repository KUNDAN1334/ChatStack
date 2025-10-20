FROM python:3.11

WORKDIR /app

COPY . .

RUN apt-get update && apt-get install -y ca-certificates && update-ca-certificates
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8080

CMD ["python", "-m", "app.main"]
