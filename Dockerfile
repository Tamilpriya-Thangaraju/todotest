# Stage 1: Build backend (Maven)
FROM maven:3.9-eclipse-temurin-21 AS backend-builder
WORKDIR /app/backend
COPY backend/tododash/pom.xml .
COPY backend/tododash/src ./src
COPY backend/tododash/.mvn ./.mvn
COPY backend/tododash/mvnw .
RUN mvn clean package -DskipTests

# Stage 2: Build frontend (Node.js)
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json package-lock.json* ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 3: Runtime - Java backend with Nginx frontend
FROM eclipse-temurin:21-jre
WORKDIR /app

# Install Nginx
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Copy built backend JAR
COPY --from=backend-builder /app/backend/target/tododash-0.0.1-SNAPSHOT.jar ./backend.jar

# Copy built frontend
COPY --from=frontend-builder /app/frontend/dist /var/www/html

# Configure Nginx
RUN rm /etc/nginx/sites-enabled/default
COPY nginx.conf /etc/nginx/sites-enabled/default

# Expose ports
EXPOSE 8080 80

# Start both services
CMD ["sh", "-c", "nginx && java -jar backend.jar"]
