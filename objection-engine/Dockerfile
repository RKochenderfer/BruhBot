# ---------- 1. Builder Stage ----------
FROM python:3.9 as builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ffmpeg libsm6 g++ pkg-config libicu-dev python3-tk python3-dev && \
    rm -rf /var/lib/apt/lists/*

# Upgrade pip and install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip setuptools wheel \
    && pip install --prefix=/install --no-cache-dir -r requirements.txt

# ---------- 2. Runtime Stage ----------
FROM python:3.9-slim

WORKDIR /app

# Install only runtime system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ffmpeg libsm6 libicu-dev python3-tk && \
    rm -rf /var/lib/apt/lists/*

# Copy installed Python packages from builder
COPY --from=builder /install /usr/local

# Copy application code
COPY . .

EXPOSE 5000
CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0"]