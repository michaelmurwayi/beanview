# ===============================
# Dockerfile for Django + MySQL
# ===============================

FROM python:3.13-slim

# Set working directory
WORKDIR /app

# -------------------------------
# 1️⃣ Install system dependencies
# -------------------------------
RUN apt-get update && apt-get install -y \
    gcc \
    libmariadb-dev \
    default-libmysqlclient-dev \
    pkg-config \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# -------------------------------
# 2️⃣ Install Python dependencies
# -------------------------------
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# -------------------------------
# 3️⃣ Copy source code
# -------------------------------
COPY . .

# -------------------------------
# 4️⃣ Ensure latest farmers.xlsx
# -------------------------------
# Copy AFTER the rest of the project to force Docker cache refresh
# whenever this file changes
COPY farmers.xlsx /app/farmers.xlsx

# -------------------------------
# 5️⃣ Entrypoint setup
# -------------------------------
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# -------------------------------
# 6️⃣ Expose port & run app
# -------------------------------
EXPOSE 8000
ENTRYPOINT ["/entrypoint.sh"]
