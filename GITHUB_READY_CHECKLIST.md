# GitHub-ready checklist — Finance integration

## Confirmed working
- Spring Boot starts successfully on Java 17.
- MySQL connection works.
- JWT login works.
- ADMIN can access `/api/finance/**`.
- FINANCE_OFFICER can access `/api/finance/**`.
- CUSTOMER receives `403 Forbidden` for finance management endpoints.
- Quotation creation and calculations work.
- Invoice creation, partial payment, full payment, and status updates work.
- Vendor payment PENDING -> PAID flow works.
- Paid vendor payments update the event budget automatically.
- Financial records and summary work.
- Invoice PDF generation works.

## Before running locally
Either set these environment variables:

- `DB_URL` (optional; defaults to local `event_planning_db`)
- `DB_USERNAME` (optional; defaults to `eventapp`)
- `DB_PASSWORD` (required)
- `JWT_SECRET` (required; at least 32 characters)
- `SERVER_PORT` (optional; defaults to `8080`)
- `JWT_EXPIRATION` (optional; defaults to `86400000`)

Or copy:

`backend/src/main/resources/application-local.example.yml`

to:

`backend/src/main/resources/application-local.yml`

Then run with profile `local` (for example, set `SPRING_PROFILES_ACTIVE=local`).

## Git workflow recommendation
1. Create/use your own finance branch.
2. Do not commit `.idea`, `*.iml`, `target`, `.env`, or `application-local.yml`.
3. Commit only source code, `pom.xml`, shared `application.yml`, docs, and intended static resources.
4. Push the finance branch.
5. Open a Pull Request into the group's integration branch/main after teammates review it.
6. Do not force-push or overwrite another member's branch.

## Important integration note
`bookingId` remains a string reference because the current repository does not contain a Customer Portal / Event Booking branch. Event and vendor references are validated against the real group entities currently available.
