# Stage 1: Build frontend (Node.js)
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy package files first
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci --prefer-offline --no-audit

# Copy source code
COPY frontend/ .

# Build the frontend
RUN npm run build

# Stage 2: Build backend (Java/Maven)
FROM maven:3.9-eclipse-temurin-21 AS backend-builder
WORKDIR /app/backend

# Copy the entire backend directory
COPY backend/tododash/ .

# Build backend
RUN mvn clean package -DskipTests

# Stage 3: Runtime - Java backend with Nginx for frontend
FROM eclipse-temurin:21-jre
WORKDIR /app

# Install nginx and curl for health checks
RUN apt-get update && apt-get install -y nginx curl && rm -rf /var/lib/apt/lists/*

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built backend JAR
COPY --from=backend-builder /app/backend/target/*.jar /app/app.jar

# Copy built frontend to nginx serving directory
COPY --from=frontend-builder /app/frontend/dist /var/www/html

# Create nginx directories if they don't exist
RUN mkdir -p /var/www/html

# Expose ports
EXPOSE 80 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Start both nginx and Java application
CMD service nginx start && java -jar /app/app.jar
