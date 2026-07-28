# Bucketick API

The backend for the Bucketick mobile app. Express + TypeScript + MongoDB (via
Mongoose) with JWT auth. Standalone service, no monorepo wiring.

## Setup

```bash
cd bucketick-api
npm install
cp .env.example .env      # then paste your MongoDB connection string into .env
```

Set `MONGODB_URI` in `.env` to your own database (MongoDB Atlas or a local
mongod). `.env` is gitignored, so your credentials never get committed.

## Run

```bash
npm run seed    # optional: wipes the DB and inserts demo users, lists, follows
npm run dev     # start the API on http://localhost:8090 (auto-reloads)
```

Production:

```bash
npm run build && npm start
```

## Verify without a database

```bash
npm run smoke   # spins up an in-memory MongoDB and runs the full API end to end
```

## Auth model

- Access token (JWT, short-lived) sent as `Authorization: Bearer <token>`.
- Refresh token (JWT, long-lived). On a 401 the client POSTs it to
  `/api/v1/auth/refresh` to get a fresh pair.
- Passwords hashed with bcrypt. Tokens are stateless (logout is client-side).

## Response shape

Success: `{ "data": <payload> }`. Error: `{ "message", "errorCode", "details" }`
with the matching HTTP status.

## Endpoints (all under `/api/v1`)

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/auth/register` | Create account, returns tokens + user |
| POST | `/auth/login` | Log in, returns tokens + user |
| POST | `/auth/refresh` | Exchange a refresh token for a new pair |
| POST | `/auth/logout` | No-op (stateless) |
| GET | `/users/me` | Current user |
| PATCH | `/users/me` | Update name / bio / avatar color |
| GET | `/lists` | My lists (with item counts) |
| POST | `/lists` | Create a list |
| GET | `/lists/:id` | One list |
| PATCH | `/lists/:id` | Edit a list |
| DELETE | `/lists/:id` | Delete a list (and its items) |
| GET | `/lists/:id/items` | Items in a list |
| POST | `/lists/:id/items` | Add an item |
| PATCH | `/items/:id` | Edit an item / change status |
| DELETE | `/items/:id` | Delete an item |
| GET | `/leaderboard` | Top players plus my rank |
| GET | `/follows/followers` | People who follow me |
| GET | `/follows/following` | People I follow |
| GET | `/follows/suggestions` | People I could follow |
| POST | `/follows/:userId` | Follow someone |
| DELETE | `/follows/:userId` | Unfollow someone |

Points: each completed dream is worth 50, each in-progress dream 15. Counters on
the user document are recomputed after every mutation, so the leaderboard stays a
simple sorted query.

## Data model

- **User** — name, unique username + email, bcrypt hash, avatar color, bio,
  denormalized counters (followers, following, lists, completed, points).
- **List** — owner, title, description, visibility, category, accent color.
- **Item** — list + owner refs, title, note, status (dreaming / in_progress /
  completed), location, completedAt.
- **Follow** — a unique (follower, following) edge.
