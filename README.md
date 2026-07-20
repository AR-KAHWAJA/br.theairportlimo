# BlinkRide MERN Conversion

This is a MERN rebuild of the WordPress site at `https://br.theairportlimo.com/`.

GitHub Pages frontend: `https://ar-kahwaja.github.io/br.theairportlimo/`

## What is included

- React frontend built with Rollup and Babel, with routes for Home, Services, Customers, Drivers, Affiliates, Fleet, About Us, Contact Us, and Get the App.
- Local image assets copied from the WordPress media library.
- Express API for contact inquiries, ride reservations, and app-interest leads.
- Nodemailer email notifications for contact, reservation, and app-interest submissions.
- MongoDB/Mongoose models. If `MONGODB_URI` is not configured, the server still runs and stores submissions in memory for local testing.

## Run locally

```bash
npm run install:all
npm run dev
```

Frontend: `http://localhost:5173`

API: `http://localhost:5174/api`

## Production build

```bash
npm run build
npm --prefix server start
```

The Express server will serve `client/dist` after the frontend build.

## Production deployment

Use Node.js 20 or newer.

Build command:

```bash
npm run build:production
```

Start command:

```bash
npm run start:production
```

Set production environment variables in your hosting panel. Do not commit real values. Use
`.env.production.example` or `server/.env.production.example` as the template.

Recommended production values:

```bash
NODE_ENV=production
PORT=5174
CLIENT_ORIGIN=https://br.theairportlimo.com
MONGODB_URI=mongodb+srv://USER:PASSWORD@HOST/blinkride?retryWrites=true&w=majority
SUBMISSIONS_TOKEN=replace-with-a-long-random-secret
SUBMISSIONS_DEFAULT_LIMIT=25
SUBMISSIONS_MAX_LIMIT=100
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
MAIL_FROM="BlinkRide <email@br.theairportlimo.com>"
MAIL_TO=wpadmin@techhorizon.tech
MAIL_CC=etech.afzaal@gmail.com
MAIL_BCC=etech.abdulrehman@gmail.com
```

`/api/submissions` is disabled unless `SUBMISSIONS_TOKEN` is configured. Access it with:

```bash
Authorization: Bearer your-token
```

The protected submissions endpoint supports pagination:

```bash
GET /api/submissions?page=1&limit=25
GET /api/submissions?type=reservations&page=2&limit=10
```

## GitHub production environment

This repo includes `.github/workflows/production.yml`. In GitHub, create an environment named
`production` and add the values listed in `.github/PRODUCTION_ENV.md`.

Use GitHub environment variables for non-secrets:

```bash
CLIENT_ORIGIN=https://br.theairportlimo.com
SUBMISSIONS_DEFAULT_LIMIT=25
SUBMISSIONS_MAX_LIMIT=100
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=email@br.theairportlimo.com
MAIL_FROM="BlinkRide <email@br.theairportlimo.com>"
MAIL_TO=wpadmin@techhorizon.tech
MAIL_CC=etech.afzaal@gmail.com
MAIL_BCC=etech.abdulrehman@gmail.com
```

Use GitHub environment secrets for private values:

```bash
MONGODB_URI
SUBMISSIONS_TOKEN
SMTP_PASS
```

## Environment

Copy `server/.env.example` to `server/.env` or set these variables in your deployment platform:

```bash
PORT=5174
CLIENT_ORIGIN=https://your-domain.com
MONGODB_URI=mongodb+srv://...
SUBMISSIONS_TOKEN=replace-with-a-long-random-secret
SUBMISSIONS_DEFAULT_LIMIT=25
SUBMISSIONS_MAX_LIMIT=100
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
MAIL_FROM="BlinkRide <email@br.theairportlimo.com>"
MAIL_TO=wpadmin@techhorizon.tech
MAIL_CC=etech.afzaal@gmail.com
MAIL_BCC=etech.abdulrehman@gmail.com
```

When SMTP variables are missing, submissions still work and the API response reports that email was skipped.
