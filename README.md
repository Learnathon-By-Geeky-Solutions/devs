# Roamance Backend

## Overview
Roamance is a social travel platform that enhances the travel experience through interactive features, AI-powered recommendations, and community engagement. This repository contains the backend implementation using Spring Boot.

## Team Information

### Team Members
- jahidem (Team Leader)
- R1B3n-13
- yashrif

### Mentor
- kaziasifjawwad

## Tech Stack
- Java 21
- Spring Boot 3.2.x
- Gradle 8.x
- PostgreSQL 17
- WebSocket
- Spring Security
- Spring Data JPA

## Prerequisites
- JDK 21 or higher
- Gradle 8.x
- PostgreSQL 17
- Docker (optional, for containerization)

## Project Structure
```
src/
├── main/
│   ├── java/
│   │   └── com/
│   │       └── roamance/
│   │           ├── RoamanceApplication.java
│   │           ├── config/
│   │           ├── controller/
│   │           ├── model/
│   │           ├── repository/
│   │           ├── service/
│   │           ├── security/
│   │           └── util/
│   └── resources/
│       ├── application.yml
│       ├── application-dev.yml
│       └── application-prod.yml
└── test/
    └── java/
        └── com/
            └── roamance/
                └── ...
```

## Getting Started

### Development Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Learnathon-By-Geeky-Solutions/devs.git
   cd devs
   ```

2. Configure your database in `application-dev.yml`:
   ```yaml
   spring:
     datasource:
       url: ${DB_URL}
       username: ${DB_USERNAME}
       password: ${DB_PASSWORD}
   ```

3. Build the project:
   ```bash
   ./gradlew clean build
   ```

4. Run the application:
   ```bash
   ./gradlew bootRun
   ```

The application will be available at `http://localhost:8080`

### Docker Setup
1. Build the Docker image:
   ```bash
   docker build -t roamance-backend .
   ```

2. Run the container:
   ```bash
   docker run -p 8080:8080 roamance-backend
   ```

## API Documentation
API documentation is available through Swagger UI at `http://localhost:8080/swagger-ui.html` when running in development mode.

## Features

### Core Functionalities
- User Authentication and Authorization
- Profile Management
- Travel Planning and Itinerary Creation
- Social Networking Features
- AI-Powered Recommendations
- Interactive Map Integration
- Real-time Updates via WebSocket
- Image Processing and Storage
- Search Functionality with Elasticsearch

### API Endpoints
- `/api/v1/auth/*` - Authentication endpoints
- `/api/v1/users/*` - User management
- `/api/v1/trips/*` - Trip and itinerary management
- `/api/v1/social/*` - Social networking features
- `/api/v1/places/*` - Location and place data
- `/api/v1/search/*` - Search functionality

## Configuration

### Environment Variables
```properties
DB_URL=jdbc:postgresql://localhost:5432/roamance
DB_USERNAME=<database_username>
DB_PASSWORD=<database_password>
JWT_SECRET=<your_secure_secret_key>
```

### Application Properties
Key application properties can be configured in `application.yml`:
- Server port
- Database connections
- Security settings
- File upload limits
- Caching configuration
- Logging levels

## Testing
- Run unit tests:
  ```bash
  ./gradlew test
  ```
- Run integration tests:
  ```bash
  +./gradlew integrationTest # Requires custom Gradle task configuration
  ```

## Deployment
1. Build the production package:
   ```bash
   ./gradlew bootJar
   ```

2. The built JAR will be in `build/libs/`

3. Deploy using the provided Dockerfile or your preferred deployment method

## Monitoring
- Actuator endpoints available at `/actuator/*`
- Prometheus metrics at `/actuator/prometheus`
- Health check at `/actuator/health`

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
[MIT License](LICENSE)
