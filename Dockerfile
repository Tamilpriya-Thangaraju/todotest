# ---------- Stage 1: Build Frontend ----------
FROM node:20-alpine AS frontend-build
WORKDIR /app

# Copy only manifest files first (better caching)
COPY frontend/package*.json ./

# Use npm ci when lockfile exists; fallback to npm install if not.
RUN if [ -f package-lock.json ]; then \
      npm ci --prefer-offline --no-audit --legacy-peer-deps; \
    else \
      npm install --prefer-offline --no-audit --legacy-peer-deps; \
    fi

# Copy the rest of the frontend source and build
COPY frontend/ .
RUN npm run build

# ---------- Stage 2: Build Backend ----------
FROM maven:3.9.9-eclipse-temurin-21 AS backend-build
WORKDIR /app

# Prime the Maven cache
COPY backend/tododash/pom.xml ./pom.xml
RUN mvn -B -q -DskipTests dependency:go-offline

# Copy backend sources
COPY backend/tododash/ ./

# Place the built frontend into Spring Boot's static resources BEFORE packaging
# If your frontend output is "build" (CRA), change /app/dist/ to /app/build/
RUN mkdir -p src/main/resources/static
COPY --from=frontend-build /app/dist/ src/main/resources/static/

# Package the Spring Boot app
RUN mvn -B -DskipTests clean package

# ---------- Stage 3: Runtime ----------
FROM eclipse-temurin:21-jre
WORKDIR /app

# (Optional) If you want HEALTHCHECK via curl, install curl. Otherwise, remove this block.
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Copy the packaged jar
COPY --from=backend-build /app/target/*.jar /app/app.jar

EXPOSE 8080

# Health check (Spring Boot actuator)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -sf http://localhost:8080/actuator/health || exit 1

# Use JSON exec form; single process (no shell)
ENTRYPOINT ["java","-jar","/app/app.jar"]