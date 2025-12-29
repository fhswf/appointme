[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
![GitHub issues](https://img.shields.io/github/issues/fhswf/appointme)
![GitHub pull request check state](https://img.shields.io/github/status/s/pulls/fhswf/appointme/10)
[![Quality Gate Status](https://sonarqube.fh-swf.cloud/api/project_badges/measure?project=fhswf_appointme_4a6870c1-a6b0-4818-9a4f-c9256685c9d3&metric=alert_status&token=sqb_5deb3d670ea0a882f6563a07b9bea9dee035bcb6)](https://sonarqube.fh-swf.cloud/dashboard?id=fhswf_appointme_4a6870c1-a6b0-4818-9a4f-c9256685c9d3)

# APPointment

This web application helps you planning your appointments.

As a _provider_ of appointments (i.e. consultation hours) you can manage times when you are available for different types of appointments
(online, in person, different durations) and integrate your Google calendar.

As a _client_, you can search for available slots and book an appointment. You will receive an invitation from the calendar service of the provider.

## Deployment

### Deployment on Kubernetes

To deploy the application on Kubernetes, you need to create the necessary ConfigMap and Secret resources.

1.  **Prepare Configuration:**
    Detailed configuration templates are provided in `backend/k8s/`.
    *   `backend/k8s/configmap.yaml.example`: Use this as a template. Rename it to `configmap.yaml` (or create a new one). **This is the central configuration for both backend and client.**
        *   Updates to `API_URL` and `CLIENT_URL` here will configure the Backend.
        *   Updates to `REACT_APP_API_URL` and `REACT_APP_URL` here will be injected into the Client.
        *   Set `MONGO_URI` and `CORS_ALLOWED_ORIGINS` as needed.
    *   `backend/k8s/secret.yaml.example`: Use this as a template. Rename it to `secret.yaml` (or create a new one) and set sensitive secrets. **Important:** Replace the placeholder values (e.g., `changeme`) with your actual secrets before applying.

2.  **Apply Resources:**
    ```bash
    # Example command (after creating the actual files)
    kubectl apply -f backend/k8s/configmap.yaml
    kubectl apply -f backend/k8s/secret.yaml
    ```

3.  **Deploy Application:**
    ```bash
    ```bash
    kubectl apply -f backend/k8s/deployment.yaml
    ```

### Environment Overlays (Staging/Production)

You can manage multiple environments (e.g., Staging, Production) using Kustomize overlays located in `k8s/overlays/`.

1.  **Create an Overlay:**
    Copy an existing overlay (e.g., `k8s/overlays/dev`) to `k8s/overlays/staging` or `k8s/overlays/prod`.

2.  **Customize `kustomization.yaml`:**
    *   Set the `namespace` for the environment.
    *   Reference the base resources.
    *   Add patches for `Ingress` (to set the correct host) and `ConfigMap` (see below).

3.  **Patch `ConfigMap`:**
    Create a `configmap-patch.yaml` in your overlay directory to override environment-specific values like module URLs.
    
    ```yaml
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: appointme
    data:
      API_URL: "https://staging.example.com/api/v1"
      CLIENT_URL: "https://staging.example.com"
      REACT_APP_API_URL: "https://staging.example.com/api/v1"
      REACT_APP_URL: "https://staging.example.com"
    ```

4.  **Deploy:**
    ```bash
    kubectl apply -k k8s/overlays/staging
    ```

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
| `ENCRYPTION_KEY` | 32-byte hex key for encrypting CalDAV passwords | Yes | |

## LTI Integration

APPointment supports **LTI 1.3** (Learning Tools Interoperability) integration through **OpenID Connect (OIDC)**. This allows the application to be integrated into Learning Management Systems (LMS) like Moodle, Canvas, or other LTI-compliant platforms.

### How It Works

The LTI integration is implemented using the standard OIDC authentication flow:

1. **Authentication Flow**:
   - User clicks "Login with OIDC" in the application
   - Client fetches authorization URL from `/api/v1/oidc/url`
   - User is redirected to the OIDC provider (e.g., Keycloak, LMS LTI endpoint)
   - After successful authentication, user is redirected back to `/oidc-callback` with authorization code
   - Client sends code to `/api/v1/oidc/login` endpoint
   - Backend exchanges code for tokens and retrieves user claims
   - User is created or updated in the database based on email
   - JWT token is issued and set as HTTP-only cookie

2. **LTI Role Mapping**:
   The application automatically maps LTI roles from the OIDC claims to internal application roles:
   - LTI roles are extracted from `https://purl.imsglobal.org/spec/lti/claim/roles` claim
   - Users with roles containing "student" or "learner" (case-insensitive) are assigned the `student` role
   - Additional role mappings can be extended in [`oidc_controller.ts`](backend/src/controller/oidc_controller.ts)

3. **User Creation**:
   - Users are identified by their `sub` (subject) claim from the OIDC token
   - User profile is created/updated with:
     - Email (required)
     - Name (from `name` claim or derived from email)
     - Profile picture (from `picture` claim, if provided)
     - Roles (mapped from LTI roles)
   - User URL collisions are automatically handled with random suffixes

### Configuration

To enable LTI/OIDC authentication, configure the following environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `OIDC_ISSUER` | OIDC Provider/LTI Platform URL | `https://keycloak.example.com/realms/myrealm` |
| `OIDC_CLIENT_ID` | OIDC Client ID registered with the provider | `appointme` |
| `OIDC_CLIENT_SECRET` | Client Secret (for confidential clients) | `your-secret-here` |
| `OIDC_NAME` | Display name for the login button (optional) | `Campus-ID` |
| `OIDC_ICON` | Icon path for the login button (optional) | `/fh-swf.svg` |

### Setting Up with Keycloak

1. Create a new client in Keycloak:
   - Client ID: Your desired client ID (e.g., `appointme`)
   - Client Protocol: `openid-connect`
   - Access Type: `confidential` (if using client secret) or `public`
   - Valid Redirect URIs: `https://your-domain.com/oidc-callback`

2. Configure LTI Claims (if using LTI):
   - Ensure the client mapper includes `https://purl.imsglobal.org/spec/lti/claim/roles` in the ID token
   - Map user roles appropriately (e.g., Student, Instructor)

3. Set environment variables in your deployment with the Keycloak realm URL and client credentials

### Setting Up with LMS (Moodle/Canvas)

Most modern LMS platforms support LTI 1.3 with OIDC. Configure the LMS as your OIDC provider:

1. Register APPointment as an external tool in your LMS
2. Configure the OIDC endpoints according to your LMS documentation
3. Use the LMS-provided issuer URL, client ID, and client secret in your environment variables
4. Ensure the LMS sends appropriate role claims for student/instructor identification

### Security Features

- **Rate Limiting**: 
  - Authorization URL endpoint: 100 requests per 15 minutes per IP
  - Login endpoint: 5 attempts per minute per IP
- **HTTP-only Cookies**: JWT tokens are stored in secure, HTTP-only cookies
- **Token Validation**: All tokens are validated using the OIDC provider's public keys (JWKS)
- **CORS Protection**: Configurable allowed origins via `CORS_ALLOWED_ORIGINS`

### API Endpoints

- `GET /api/v1/oidc/config` - Check if OIDC is enabled
- `GET /api/v1/oidc/url` - Get authorization URL for authentication
- `POST /api/v1/oidc/login` - Complete authentication with authorization code

### Technical Implementation

The LTI/OIDC integration is implemented in:
- Backend controller: [`backend/src/controller/oidc_controller.ts`](backend/src/controller/oidc_controller.ts)
- Backend routes: [`backend/src/routes/oidc_routes.ts`](backend/src/routes/oidc_routes.ts)
- Client callback handler: [`client/src/pages/OidcCallback.tsx`](client/src/pages/OidcCallback.tsx)

For detailed implementation, see the source code in the repository.


