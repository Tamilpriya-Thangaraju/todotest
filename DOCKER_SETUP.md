# Docker Setup Guide

## Quick Start

### Build the Docker Image

```bash
docker build -t tododash:latest .
```

### Run the Container

```bash
docker run -p 80:80 -p 8080:8080 tododash:latest
```

Access the application at:
- **Frontend:** http://localhost
- **Backend API:** http://localhost:8080/api
- **H2 Console:** http://localhost:8080/h2-console

---

## Using Docker Compose

### Start the Application

```bash
docker-compose up --build
```

### Stop the Application

```bash
docker-compose down
```

### View Logs

```bash
docker-compose logs -f tododash
```

---

## Folder Structure

```
todotest/
├── .github/
│   └── workflows/
│       └── docker-build.yml          # GitHub Actions CI/CD pipeline
├── backend/
│   └── tododash/                     # Spring Boot application
│       ├── src/
│       ├── pom.xml
│       └── ...
├── frontend/
│   ├── src/                          # React/Vite application
│   ├── package.json
│   └── ...
├── Dockerfile                        # Multi-stage build
├── docker-compose.yml               # Local development compose file
├── nginx.conf                       # Nginx configuration
├── .dockerignore                    # Docker build ignore file
└── .env.example                     # Environment variables template
```

---

## Github Actions Workflow

### What It Does

The `.github/workflows/docker-build.yml` file runs:

1. **Build Tests:**
   - Backend: Maven tests
   - Frontend: NPM lint & build

2. **Docker Build & Push:**
   - Builds multi-stage Docker image
   - Pushes to Docker Hub and GitHub Container Registry (main branch only)
   - Caches layers for faster builds

### Setting Up Secrets

To push images to Docker Hub and GitHub Container Registry, add these secrets to your GitHub repository:

1. `DOCKER_USERNAME` - Your Docker Hub username
2. `DOCKER_PASSWORD` - Your Docker Hub access token

Go to: **Settings → Secrets and variables → Actions → New repository secret**

---

## Dockerfile Details

### Build Stages

**Stage 1: Backend Builder**
- Uses Maven 3.9 with Eclipse Temurin JDK 21
- Builds JAR file from Spring Boot project

**Stage 2: Frontend Builder**
- Uses Node.js 20 Alpine
- Installs dependencies and builds Vite production bundle

**Stage 3: Runtime**
- Uses Eclipse Temurin JRE 21 (lightweight)
- Installs Nginx
- Copies both built artifacts
- Runs both services simultaneously

### Service Port Mapping

- **Nginx (Frontend):** Port 80
- **Spring Boot (Backend):** Port 8080

---

## Environment Variables

See `.env.example` for available configuration options.

To use custom environment variables, create a `.env` file:

```bash
cp .env.example .env
# Edit .env with your values
docker run --env-file .env -p 80:80 -p 8080:8080 tododash:latest
```

---

## Troubleshooting

### Build Fails
```bash
# Clean and rebuild
docker build --no-cache -t tododash:latest .
```

### Port Already in Use
```bash
# Use different ports
docker run -p 8000:80 -p 8081:8080 tododash:latest
```

### View Logs
```bash
docker logs <container-id>
```

### Access Container Shell
```bash
docker exec -it <container-id> /bin/bash
```

---

## Production Considerations

1. Use environment-specific configurations
2. Add health checks to Dockerfile
3. Set resource limits (`--memory`, `--cpus`)
4. Use a reverse proxy (e.g., Traefik, HAProxy)
5. Enable logging drivers for centralized logging
6. Consider using Kubernetes for orchestration

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Spring Boot Docker Guide](https://spring.io/guides/topicals/spring-boot-docker)
- [Vite Documentation](https://vitejs.dev/)
