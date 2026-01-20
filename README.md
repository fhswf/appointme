[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
![GitHub issues](https://img.shields.io/github/issues/fhswf/appointme)
![GitHub pull request check state](https://img.shields.io/github/status/s/pulls/fhswf/appointme/10)
[![Quality Gate Status](https://sonarqube.fh-swf.cloud/api/project_badges/measure?project=fhswf_appointme_4a6870c1-a6b0-4818-9a4f-c9256685c9d3&metric=alert_status&token=sqb_5deb3d670ea0a882f6563a07b9bea9dee035bcb6)](https://sonarqube.fh-swf.cloud/dashboard?id=fhswf_appointme_4a6870c1-a6b0-4818-9a4f-c9256685c9d3)

# APPointment

This web application helps you planning your appointments.

As a _provider_ of appointments (i.e. consultation hours) you can manage times when you are available for different types of appointments
(online, in person, different durations) and integrate your Google calendar.

As a _client_, you can search for available slots and book an appointment. You will receive an invitation from the calendar service of the provider.

Full documentation is available at [https://fhswf.github.io/appointme/](https://fhswf.github.io/appointme/).

## Deployment

### Deployment on Kubernetes

To deploy the application on Kubernetes, you need to create the necessary ConfigMap and Secret resources.

1.  **Prepare Configuration:**
    Detailed configuration templates are provided in `backend/k8s/`.
    *   `backend/k8s/configmap.yaml.example`: Use this as a template. Rename it to `configmap.yaml` (or create a new one). **This is the central configuration for both backend and client.**
        *   Updates to `API_URL` and `BASE_URL` here will configure the Backend.
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
    kubectl apply -f backend/k8s/deployment.yaml
    ```

4.  **Deploy MCP Server:**
    The MCP server is a separate deployment that integrates with the backend.
    
    ```bash
    kubectl apply -k mcp-server/k8s/base
    ```
    
    The Ingress handles routing:
    *   `/` -> Client
    *   `/api` -> Backend
    *   `/mcp` -> MCP Server


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
      BASE_URL: "https://staging.example.com"
      REACT_APP_API_URL: "https://staging.example.com/api/v1"
      REACT_APP_URL: "https://staging.example.com"
    ```

4.  **Deploy:**
    ```bash
    kubectl apply -k k8s/overlays/staging
    ```


### Deployment with ArgoCD

To deploy with ArgoCD, you can use the Application manifests provided in `k8s/argocd/`.

Example `k8s/argocd/prod.yaml`:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: appointme-prod
  namespace: argocd
spec:
  project: default
  source:
    repoURL: 'https://github.com/fhswf/appointme'
    targetRevision: HEAD
    path: k8s/overlays/prod
  destination:
    server: https://kubernetes.default.svc
    namespace: appointme-prod
  syncPolicy:
    automated: {}
  orphanedResources:
    warn: true # Warn about other unknown resources
    ignore:
      - kind: Secret
        name: "argocd-secret"
```

### Configuration


- provide details in `docker.env` and `.env`

#### Configuration Values

| Variable | Description | Required | Default | Source |
|----------|-------------|----------|---------|--------|
| `MONGO_URI` | Connection string for MongoDB | Yes | | ConfigMap: `appointme` |
| `BASE_URL` | URL of the frontend application (e.g., `https://example.com`) | Yes | | ConfigMap: `appointme` |
| `API_URL` | URL of the backend API (e.g., `https://api.example.com/api/v1`) | Yes | | ConfigMap: `appointme` |
| `BASE_PATH` | Base path of the application | No | `/` | ConfigMap: `appointme` |
| `DOMAIN` | Domain for cookie scoping (e.g. `example.com`) | No | | ConfigMap: `appointme` (implied) |
| `JWT_SECRET` | Secret key for signing JWTs | Yes | | Secret: `appointme-secret` |
| `CSRF_SECRET` | Secret key for CSRF protection | Yes | | Secret: `appointme-secret` |
| `ADMIN_API_KEY` | API Key for admin/cron operations | Yes | | Secret: `appointme-secret` |
| `SENTRY_DSN` | Sentry DSN for error tracking | No | | Secret: `appointme-secret` |
| `CLIENT_ID` | Google OAuth2 Client ID | No (if Google Login disabled) | | Secret: `appointme-secret` |
| `CLIENT_SECRET` | Google OAuth2 Client Secret | No (if Google Login disabled) | | Secret: `appointme-secret` |
| `DISABLE_GOOGLE_LOGIN`| Set to `true` to disable Google Login | No | `false` | ConfigMap: `appointme` |
| `OIDC_ISSUER` | OIDC Provider URL (e.g., Keycloak Realm URL) | No (if OIDC disabled) | | ConfigMap: `appointme` |
| `OIDC_CLIENT_ID` | OIDC Client ID | No (if OIDC disabled) | | ConfigMap: `appointme` |
| `OIDC_CLIENT_SECRET` | OIDC Client Secret (for Confidential clients) | No | | Secret: `appointme-secret` |
| `EMAIL_FROM` | Email address for sending notifications | Yes | | Secret: `appointme-secret` |
| `EMAIL_PASSWORD` | Password for the email account | Yes | | Secret: `appointme-secret` |
| `ENCRYPTION_KEY` | 32-byte hex key for encrypting CalDAV passwords | Yes | | Secret: `appointme-secret` |
| `CONTACT_INFO` | Contact information (Markdown supported) | No | | ConfigMap: `appointme` |
| `REACT_APP_API_URL` | Public API URL for the React Client | Yes | | ConfigMap: `appointme` |
| `REACT_APP_URL` | Public URL of the React Client | Yes | | ConfigMap: `appointme` |

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

| Variable | Description | Example | Source |
|----------|-------------|---------|--------|
| `OIDC_ISSUER` | OIDC Provider/LTI Platform URL | `https://keycloak.example.com/realms/myrealm` | ConfigMap: `appointme` |
| `OIDC_CLIENT_ID` | OIDC Client ID registered with the provider | `appointme` | ConfigMap: `appointme` |
| `OIDC_CLIENT_SECRET` | Client Secret (for confidential clients) | `your-secret-here` | Secret: `appointme-secret` |
| `OIDC_NAME` | Display name for the login button (optional) | `Campus-ID` | ConfigMap: `appointme` |
| `OIDC_ICON` | Icon path for the login button (optional) | `/fh-swf.svg` | ConfigMap: `appointme` |
| `LTI_ISSUER` | LTI Issuer URL (Overrides OIDC_ISSUER for LTI) | `https://moodle.example.com` | ConfigMap: `appointme` |
| `LTI_CLIENT_ID` | LTI Client ID (Overrides OIDC_CLIENT_ID for LTI) | `client-123` | ConfigMap: `appointme` |
| `LTI_CLIENT_SECRET` | LTI Client Secret (Overrides OIDC_CLIENT_SECRET) | `secret-456` | Secret (Implicit?) |
| `LTI_AUTH_ENDPOINT` | LTI Authorization Endpoint | `https://moodle.example.com/mod/lti/auth.php` | ConfigMap: `appointme` |
| `LTI_TOKEN_ENDPOINT` | LTI Token Endpoint | `https://moodle.example.com/mod/lti/token.php` | ConfigMap: `appointme` |
| `LTI_JWKS_URI` | LTI JWKS URI | `https://moodle.example.com/mod/lti/certs.php` | ConfigMap: `appointme` |

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
 
 Most modern LMS platforms support LTI 1.3 with OIDC. When configuring AppointMe as an External Tool (LTI 1.3), use the following settings:
 
 **Moodle Tool Configuration:**
 
 *   **Tool URL**: `[BASE_URL]` (e.g., `https://appointme.example.com`)
 *   **LTI version**: LTI 1.3
 *   **Public key type**: RSA Key
    *   *AppointMe uses `client_secret_basic` authentication (Client ID + Client Secret) to communicate with the LMS. It DOES NOT sign requests with a private key (which is what `private_key_jwt` uses).*
    *   *However, some LMS versions (like Moodle) may structurally require a Public Key to be present in the configuration form.*
    *   *If required, you can generate a "dummy" key pair to satisfy the form:*
        ```bash
        openssl genrsa -out private.key 2048
        openssl rsa -in private.key -pubout -out public.key
        ```
    *   *Paste `public.key` into Moodle. AppointMe does NOT need the private key and will NOT use this key pair. It validates the JWTs sent BY Moodle using Moodle's own public keys (fetched automatically via the Issuer URL).*
 *   **Initiate login URL**: `[API_URL]/api/v1/oidc/init` (e.g., `https://api.appointme.example.com/api/v1/oidc/init`)
 *   **Redirection URI(s)**: `[BASE_URL]/oidc-callback` (e.g., `https://appointme.example.com/oidc-callback`)
 *   **Custom parameters**: No custom parameters are required.
     *   *Roles are automatically mapped from `https://purl.imsglobal.org/spec/lti/claim/roles`.*
 
 **Environment Configuration (in AppointMe):**
 
 1.  Set `OIDC_ISSUER` to the Platform ID / Issuer URL provided by Moodle (e.g., `https://moodle.example.com`).
 2.  Set `OIDC_CLIENT_ID` to the Client ID generated by Moodle.
 3.  Set `OIDC_CLIENT_SECRET` to the Client Secret provided by Moodle (or generate one if using specific plugins).


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


