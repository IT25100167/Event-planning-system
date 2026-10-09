# Ceylon Celebrations — Finance Module Integrated with Group Backend

This package is based on the latest `user-management` branch because that branch contains the JWT/RBAC implementation. The professional Finance & Invoicing module has been added to that backend and connected to the real group `UserEntity` and `EventEntity` models.

## What is integrated

- JWT authentication from the group's `user-management` branch.
- Finance API access restricted to `FINANCE_OFFICER` and `ADMIN` roles.
- Event budgets require a real `EventEntity.eventId` from the event-management model.
- Vendor payments require a real `UserEntity.userId` whose role is `VENDOR`.
- Quotations/invoices/customer payments remain linked by `bookingId` as a string because no Customer Portal / Event Booking branch currently exists in the repository.
- Invoice PDF generation is included through OpenPDF.

## Important: the Postman calls are now authenticated

Because the finance endpoints are protected, first create/login a Finance Officer account and copy the JWT token.

For every `/api/finance/**` request add this header:

`Authorization: Bearer <your-token>`

An ADMIN token can also access finance APIs.

## Local database defaults

The project defaults to:

- Database: `event_planning_db`
- Username: `eventapp`
- Password: `eventapp123`
- Server port: `8080`

These can be overridden without editing source code:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `SERVER_PORT`
- `JWT_SECRET`
- `JWT_EXPIRATION`

If port 8080 is busy, set `SERVER_PORT=8081` in the IntelliJ run configuration.

## Integration rules

### Event budget
`POST /api/finance/budgets` checks that the event exists in the `events` table.

### Vendor payment
`POST /api/finance/vendor-payments` checks:
1. The event exists.
2. The user exists.
3. The user's role is `VENDOR`.

A vendor payment starts as `PENDING`. Only when it is changed to `PAID` does it increase the event budget's `actualSpend` and create a DEBIT financial record.

## Booking integration status

The repository currently has no customer-booking branch. Therefore `bookingId` remains a non-foreign-key string in quotation, invoice and customer-payment records. This is intentional so the finance module can be merged now without inventing another member's database model.

## Recommended merge approach

Do not replace the group's `main` blindly. Merge this module into the branch that the team selects as the integration base. Resolve shared files (`pom.xml`, `SecurityConfig.java`, `application.yml`, `GlobalExceptionHandler.java`) manually if other branches have changed them.

## GitHub-ready configuration
The shared `application.yml` does not contain a database password or JWT secret. For local development, either set `DB_PASSWORD` and `JWT_SECRET` as environment variables, or copy `application-local.example.yml` to `application-local.yml` and run with the `local` Spring profile. The local config file is ignored by Git.
