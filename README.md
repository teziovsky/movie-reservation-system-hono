# Movie Reservation System

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D23.6.0-brightgreen)](https://nodejs.org)
![Hono](https://img.shields.io/github/package-json/dependency-version/teziovsky/movie-reservation-system-hono/hono?logo=hono)
![Drizzle ORM](https://img.shields.io/github/package-json/dependency-version/teziovsky/movie-reservation-system-hono/drizzle-orm?logo=drizzle)
![Zod](https://img.shields.io/github/package-json/dependency-version/teziovsky/movie-reservation-system-hono/zod?logo=zod)
![Vitest](https://img.shields.io/github/package-json/dependency-version/teziovsky/movie-reservation-system-hono/dev/vitest?logo=vitest)
![Eslint](https://img.shields.io/github/package-json/dependency-version/teziovsky/movie-reservation-system-hono/dev/eslint?logo=eslint)
[![Docker](https://img.shields.io/badge/docker-%3E%3D20.10.0-blue)](https://www.docker.com/)

A modern movie reservation system built with Hono and Drizzle ORM. This system allows users to browse movies, make reservations, and manage their bookings while providing administrators with tools for managing movies, showtimes, and viewing analytics.

## 🚀 Features

- Fast and lightweight HTTP API with Hono
- Type-safe database operations using Drizzle ORM
- JWT-based authentication and authorization
- Role-based access control (Admin/User)
- Movie and showtime management
- Seat reservation system
- Swagger/OpenAPI documentation
- Containerized development and deployment with Docker
- Comprehensive test coverage with Vitest

## 📋 Prerequisites

- Node.js >= 23.6.0
- Docker and Docker Compose
- PNPM package manager
- PostgreSQL 15

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **API Framework:** Hono
- **Database:** PostgreSQL
- **ORM:** Drizzle
- **Authentication:** JWT (jose)
- **Validation:** Zod
- **Testing:** Vitest
- **Documentation:** OpenAPI/Swagger
- **Containerization:** Docker & Docker Compose
- **Logging:** Pino
- **Development:** TypeScript, ESLint

## 📝 TODO List

### Setup & Infrastructure

- [x] Initial project setup
- [x] Configure Docker and Docker Compose
- [x] Set up Hono framework
- [x] Configure Drizzle ORM
- [x] Set up database migrations
- [ ] Configure CI/CD pipeline
- [ ] Add monitoring and logging
- [ ] Security hardening
- [ ] Performance optimization

### Database Schema & Models

- [x] Design database schema for all entities
- [x] Create user and role models
- [x] Create movie model
- [x] Create genre model
- [x] Create showtime model
- [x] Create seat model
- [x] Create reservation model
- [x] Implement database relationships
- [x] Create seed data for initial admin

### Authentication & Authorization

- [x] Implement user registration
- [x] Implement user login with JWT
- [x] Set up role-based access control
- [x] Create admin promotion functionality
- [x] Implement authentication middleware

### Movie Management

- [x] Create CRUD endpoints for movies
- [x] Implement genre management
- [ ] Add showtime management
- [ ] Create file upload for movie posters
- [ ] Add movie search and filtering

### Seat & Reservation System

- [ ] Design seat layout management
- [ ] Implement seat availability checking
- [ ] Create seat reservation logic
- [ ] Add reservation confirmation system
- [ ] Implement reservation cancellation
- [ ] Add concurrent booking protection

### Reporting & Analytics

- [ ] Create reservation reports for admins
- [ ] Implement revenue reporting
- [ ] Add capacity utilization reports
- [ ] Create user booking history
- [ ] Implement analytics dashboard

### Testing

- [ ] Set up Vitest testing environment
- [ ] Write unit tests for models
- [ ] Write integration tests for APIs
- [ ] Add performance tests
- [ ] Create test data generators

### Documentation

- [x] Add API documentation
- [ ] Create database schema documentation
- [x] Add setup instructions

## 🚦 Getting Started

### Local Development

1. Clone the repository:

```bash
git clone git@github.com:teziovsky/movie-reservation-system-hono.git
cd movie-reservation-system-hono
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development environment:

```bash
docker-compose up -d
```

5. Access the API:

```bash
open http://localhost:${PORT}/docs
```

### Using Docker

Start the entire stack using Docker Compose:

```bash
docker-compose up -d
```

## 📊 Database Management

### Drizzle ORM Commands

Generate migrations:

```bash
npm run drizzle-kit generate
```

Apply migrations:

```bash
npm run drizzle-kit migrate
```

## 🧪 Testing

Run tests using Vitest:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📝 API Documentation

[Swagger/OpenAPI docs](http://localhost:8000/docs)

## 🐳 Docker Configuration

### Development

```yaml
# Development environment
docker-compose up -d
```

### Production

```yaml
# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Configuration

| Environment Variable | Description        | Default     |
| -------------------- | ------------------ | ----------- |
| `NODE_ENV`           | Environment mode   | development |
| `PORT`               | Server port        | 9999        |
| `LOG_LEVEL`          | Logging level      | debug       |
| `JWT_SECRET`         | JWT signing secret | secret      |
| `DATABASE_USER`      | Database username  | postgres    |
| `DATABASE_PASSWORD`  | Database password  | postgres    |
| `DATABASE_HOST`      | Database host      | localhost   |
| `DATABASE_PORT`      | Database port      | 5432        |
| `DATABASE_NAME`      | Database name      | db          |
| `DATABASE_URL`       | Full database URL  | -           |

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 👥 Authors

- **Teziovsky** - _Initial work_ - [Teziovsky](https://github.com/teziovsky/)

## 📚 Additional Resources

- [Hono Documentation](https://honojs.dev/)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Vitest Documentation](https://vitest.dev)
- [Docker Documentation](https://docs.docker.com/)
