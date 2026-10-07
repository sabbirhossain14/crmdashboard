# ClientFlow CRM

A full-stack CRM workspace for managing leads, customers, companies, contacts, deals, tasks, meetings and team activity. The app uses a React/TypeScript client and an Express/Mongoose API. Data is stored in MongoDB; authentication uses short-lived JWT access tokens and rotating refresh tokens in httpOnly cookies.

## Features

- CRM dashboard with live metrics and charts; searchable, filterable lead/customer/company/contact/deal/task/meeting views.
- Lead and customer profiles, deal table and drag-and-drop sales pipeline, team administration, reports and notification center.
- Role-aware protected routes, password reset flow, password changes, secure cookie refresh, Zod validation and centralized errors.
- Light/dark themes, responsive navigation, CSV report export, pagination-ready REST APIs, seed data and optional SMTP integration.

## Stack and layout

React, Vite, TypeScript, Tailwind, React Router, TanStack Query, Axios, React Hook Form, Zod, Framer Motion, Lucide, Recharts; Node, Express, Mongoose, JWT, bcrypt, Nodemailer.

```text
client/   React application
server/   Express API, models, auth, seed
```

## Setup

1. Install Node.js 20+ and MongoDB Community or use a MongoDB Atlas connection.
2. Copy `.env.example` to `server/.env` and set `MONGODB_URI`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET`. Set SMTP values to enable email delivery.
3. Run `npm install` then `npm run seed` to insert demo users and CRM data.
4. Run `npm run dev`; client runs at http://localhost:5173 and API at http://localhost:4000.

## Demo logins

Seeded demo password for all accounts: `ClientFlow@2026`

- Admin: `admin@example.com`
- Manager: `olivia.martin@example.com`
- Sales: `maya.chen@example.com`

## Commands

- `npm run dev` — client and API
- `npm run seed` — recreate realistic demo data
- `npm run typecheck`, `npm run lint`, `npm run build` — quality checks

## Environment and deployment

See `.env.example`. SMTP settings enable password reset and welcome email delivery. Cloudinary variables are available for image storage; profile avatar URLs can be stored without it. For deployment, build with `npm run build`, host the client static output from `client/dist`, run `server/dist/index.js`, set production secrets and `CLIENT_URL`, and use HTTPS so secure cookies are enabled. Configure a managed MongoDB instance and restrict CORS to the deployed client origin.

### Deploying on Vercel

Create **two** Vercel projects from the same GitHub repository.

**1. API project** (deploy first)

- Root Directory: `server`
- Environment variables: `MONGODB_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CLIENT_URL` (frontend origin, no trailing slash), `NODE_ENV=production`
- The Express app is exported from `server/src/app.ts` and served by `server/api/index.ts`; `server/vercel.json` rewrites every path to that function.
- Check `https://<api-domain>/api/health` after deploying.

**2. Frontend project**

- Root Directory: `client` (Vite is auto-detected)
- Environment variable: `VITE_API_URL=https://<api-domain>/api`
- `client/vercel.json` rewrites all routes to `index.html` so React Router deep links work.

**3. Finish up**

- Set the API project's `CLIENT_URL` to the real frontend URL and redeploy the API.
- Seed demo data once from your machine: put the Atlas `MONGODB_URI` in `server/.env`, then run `npm install && npm run seed`.
- In MongoDB Atlas, allow `0.0.0.0/0` under Network Access (Vercel IPs are not fixed).

**Cookies:** in production the auth cookies use `SameSite=None; Secure` so they work across two Vercel domains. Safari may still block them as third-party cookies, so for a production launch serve both projects from subdomains of one custom domain (e.g. `app.example.com` and `api.example.com`). Keep `.env` files out of Git.

## API overview

All endpoints are under `/api`: `auth`, `users`, `leads`, `customers`, `companies`, `contacts`, `deals`, `tasks`, `activities`, `meetings`, `notes`, `notifications`, `dashboard`, `reports`, and `search`. Collection endpoints accept `q`, `page`, `limit` and resource-specific filters. Protected endpoints require a valid session cookie; admin mutations are role-restricted.
