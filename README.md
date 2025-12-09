[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
![GitHub issues](https://img.shields.io/github/issues/fhswf/book_me)
![GitHub pull request check state](https://img.shields.io/github/status/s/pulls/fhswf/book_me/10)
[![Quality Gate Status](https://hopper.fh-swf.de/sonarqube/api/project_badges/measure?project=book_me&metric=alert_status&token=sqb_0a9511ceb28d567c414fc247f93e3a5ea06710a5)](https://hopper.fh-swf.de/sonarqube/dashboard?id=book_me)

# APPointment

This web application helps you planning your appointments.

As a _provider_ of appointments (i.e. consultation hours) you can manage times when you are available for different types of appointments
(online, in person, different durations) and integrate your Google calendar.

As a _client_, you can search for available slots and book an appointment. You will receive an invitation from the calendar service of the provider.

## Deployment

details tbd ...

### Configuration

- provide details in `docker.env` and `.env`

#### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGO_URI` | Connection string for MongoDB | Yes | |
| `CLIENT_URL` | URL of the frontend application (e.g., `https://example.com`) | Yes | |
| `API_URL` | URL of the backend API (e.g., `https://api.example.com/api/v1`) | Yes | |
| `JWT_SECRET` | Secret key for signing JWTs | Yes | |
| `CLIENT_ID` | Google OAuth2 Client ID | No (if Google Login disabled) | |
| `CLIENT_SECRET` | Google OAuth2 Client Secret | No (if Google Login disabled) | |
| `DISABLE_GOOGLE_LOGIN`| Set to `true` to disable Google Login | No | `false` |
| `OIDC_ISSUER` | OIDC Provider URL (e.g., Keycloak Realm URL) | No (if OIDC disabled) | |
| `OIDC_CLIENT_ID` | OIDC Client ID | No (if OIDC disabled) | |
| `OIDC_CLIENT_SECRET` | OIDC Client Secret (for Confidential clients) | No | |
| `EMAIL_FROM` | Email address for sending notifications | Yes | |
| `EMAIL_PASSWORD` | Password for the email account | Yes | |


