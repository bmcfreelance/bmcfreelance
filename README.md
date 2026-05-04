# SvelteKit + PostgreSQL — Docker Setup

Two isolated Compose files: **dev** (HMR, no build step) and **prod** (multi-stage build, Nginx, no exposed DB port).

---

## Project structure

```
sveltekit-docker/
├── app/
│   ├── src/
│   │   ├── lib/server/db.js          ← postgres.js pool (import in server files)
│   │   └── routes/
│   │       ├── +page.server.js       ← example DB query
│   │       └── +page.svelte
│   ├── Dockerfile.dev                ← runs `vite dev --host`
│   ├── Dockerfile.prod               ← multi-stage: build → lean runtime
│   ├── svelte.config.js              ← adapter-node
│   ├── vite.config.js                ← HMR + polling for Docker bind mount
│   └── package.json
├── postgres/
│   └── init/
│       └── 01_schema.sql             ← runs once on first DB start
├── nginx/
│   ├── nginx.conf                    ← reverse proxy + SSL
│   └── certs/                        ← put fullchain.pem + privkey.pem here
├── docker-compose.dev.yml
├── docker-compose.prod.yml
└── .env.prod.example                 ← copy to .env.prod and fill in secrets
```

---

## Development

### First time

```bash
# Install deps inside the container (creates node_modules on host for editor intellisense)
docker compose -f docker-compose.dev.yml run --rm app npm install

# Start everything
docker compose -f docker-compose.dev.yml up
```

docker compose -f docker-compose.dev.yml exec app npm run db:studio
docker compose -f docker-compose.dev.yml exec app npx drizzle-kit studio --host 0.0.0.0
docker compose -f docker-compose.dev.yml exec app npx drizzle-kit push

### Daily use

SvelteKit app http://localhost:5173
Drizzle Studio http://localhost:8080
Postgres (host tools) localhost:5432

docker compose -f docker-compose.dev.yml up --build

```bash
docker compose -f docker-compose.dev.yml up          # start (Ctrl+C to stop)
docker compose -f docker-compose.dev.yml up -d        # start in background
docker compose -f docker-compose.dev.yml down         # stop & remove containers
docker compose -f docker-compose.dev.yml down -v      # also wipe the DB volume
```

- App: http://localhost:5173 (HMR — save a file, browser updates instantly)
- PostgreSQL: `localhost:5432` (connect with DBeaver / psql using `postgres/postgres`)

### Adding npm packages

```bash
docker compose -f docker-compose.dev.yml exec app npm install <package>
```

### psql shell

```bash
docker compose -f docker-compose.dev.yml exec postgres psql -U postgres -d appdb
```

---

## Production

### 1. Prepare secrets

```bash
cp .env.prod.example .env.prod
# Edit .env.prod with real passwords, domain, etc.
```

### 2. Add SSL certificates

```
nginx/certs/fullchain.pem
nginx/certs/privkey.pem
```

> Tip: use [Certbot](https://certbot.eff.org/) or copy from your host's `/etc/letsencrypt/live/<domain>/`.

### 3. Update nginx.conf

Change `server_name yourdomain.com;` to your actual domain.

### 4. Deploy

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

### Useful prod commands

```bash
# View logs
docker compose -f docker-compose.prod.yml logs -f app

# Restart app only (after a new build)
docker compose -f docker-compose.prod.yml up -d --build app

# Stop everything
docker compose -f docker-compose.prod.yml --env-file .env.prod down

# DB shell
docker compose -f docker-compose.prod.yml exec postgres \
  psql -U $POSTGRES_USER -d $POSTGRES_DB
```

---

## How HMR works in Docker

| Mechanism                  | Detail                                                                                                                             |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Bind mount**             | `./app:/app` — host files are directly inside the container                                                                        |
| **node_modules exclusion** | `/app/node_modules` anonymous volume shadows the bind mount so the container's own modules are used                                |
| **Vite polling**           | `usePolling: true` in `vite.config.js` — needed on Docker Desktop (macOS/Windows) where inotify events don't cross the VM boundary |
| **`--host 0.0.0.0`**       | Makes Vite listen on all interfaces so Docker's port mapping works                                                                 |

---

## Environment variables

| Variable            | Dev value                                            | Description               |
| ------------------- | ---------------------------------------------------- | ------------------------- |
| `DATABASE_URL`      | `postgresql://postgres:postgres@postgres:5432/appdb` | Full connection string    |
| `ORIGIN`            | `http://localhost:5173`                              | SvelteKit CSRF protection |
| `POSTGRES_USER`     | `postgres`                                           | DB user                   |
| `POSTGRES_PASSWORD` | `postgres`                                           | DB password               |
| `POSTGRES_DB`       | `appdb`                                              | Database name             |

In production all sensitive vars come from `.env.prod` (never committed to git).

# bmcfreelance
