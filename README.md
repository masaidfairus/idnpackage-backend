# IDN Package Backend

Backend API for the IDN Package management system built with [NestJS](https://nestjs.com/).

---

## Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- **Docker** (for MySQL)

---

## Getting Started

### 1. Start MySQL

```bash
docker compose up -d
```

This starts a MySQL instance on port `3006` using credentials from `.env`.

### 2. Install dependencies

```bash
npm install
```

### 3. Start the server

```bash
# development
npm run start

# watch mode (recommended for development)
npm run start:dev
```

The API starts on `http://localhost:8080` (configurable via `PORT` in `.env`).

> Tables are auto-created — `synchronize: true` is set in `.env`.

---

## Available Scripts

| Command              | Description                |
| -------------------- | -------------------------- |
| `npm run start`      | Start the server           |
| `npm run start:dev`  | Start with hot-reload      |
| `npm run build`      | Compile to `dist/`         |
| `npm run lint`       | Run ESLint                 |
| `npm run test`       | Run unit tests             |
| `npm run test:e2e`   | Run end-to-end tests       |

---

## Environment Variables

All values are in `.env` at the project root.

| Variable                | Default     | Description               |
| ----------------------- | ----------- | ------------------------- |
| `MYSQL_HOST`            | `127.0.0.1` | MySQL host                |
| `MYSQL_PORT`            | `3006`      | MySQL port                |
| `MYSQL_USERNAME`        | `root`      | MySQL user                |
| `MYSQL_PASSWORD`        | `12345678`  | MySQL password            |
| `MYSQL_DATABASE`        | `idnpackage_backend` | Database name      |
| `MYSQL_SYNCHRONIZE`     | `true`      | Auto-sync schema          |
| `JWT_SECRET`            | —           | Secret for signing JWTs   |
| `PORT`                  | `8080`      | API listen port           |

---

## API Documentation

See [API.md](./API.md) for the complete API contract.
