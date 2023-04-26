# Build stage
FROM python:3.11.3 AS build

WORKDIR /app

COPY requirements.txt requirements.txt
RUN apt-get update && \
	apt-get install -y libicu-dev && \
	pip3 install --user --no-cache-dir -r requirements.txt

COPY . .

# Production stage
FROM python:3.11.3-slim-buster

WORKDIR /app

COPY --from=build /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

COPY . .

EXPOSE 5000/tcp

CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0"]