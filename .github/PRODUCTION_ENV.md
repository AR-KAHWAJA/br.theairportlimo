# GitHub Production Environment

Create a GitHub environment named `production` before deploying from `main`.

GitHub path:

`Settings > Environments > New environment > production`

## Environment Variables

Add these as production environment variables:

```text
CLIENT_ORIGIN=https://br.theairportlimo.com
SUBMISSIONS_DEFAULT_LIMIT=25
SUBMISSIONS_MAX_LIMIT=100
```

## Environment Secrets

Add these as production environment secrets:

```text
MONGODB_URI=mongodb+srv://USER:PASSWORD@HOST/blinkride?retryWrites=true&w=majority
SUBMISSIONS_TOKEN=replace-with-a-long-random-secret
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
MAIL_FROM=BlinkRide <no-reply@br.theairportlimo.com>
MAIL_TO=support@blinkride.com
```

Do not commit real `.env` files or secret values.

## Protected Submissions Pagination

The protected admin endpoint supports pagination in production:

```text
GET /api/submissions?page=1&limit=25
GET /api/submissions?type=reservations&page=2&limit=10
GET /api/submissions?type=inquiries&page=1&limit=25
GET /api/submissions?type=appInterests&page=1&limit=25
```

Send the admin token as:

```text
Authorization: Bearer YOUR_SUBMISSIONS_TOKEN
```
