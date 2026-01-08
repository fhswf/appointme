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
      CLIENT_URL: "https://staging.example.com"
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


