# Infrastructure TODOs

## Security & Reliability

### Cluster-Wide mTLS Infrastructure (Zero Trust)
Implement a robust, automated infrastructure for handling mTLS throughout the cluster, replacing manual certificate management.

#### 1. Certificate Management (`cert-manager`)
- **Action**: Install `cert-manager` in the cluster.
- **Benefit**: Automates the issuance and rotation of TLS certificates from various issuers (SelfSigned, Let's Encrypt, Vault).
- **Configuration**:
    - Create a `ClusterIssuer` (e.g., a SelfSigned root CA for internal mTLS).
    - Use `Certificate` resources to define desired certificates for each service.
    - **Why cert-manager?**: Kubernetes built-in CSR API is primarily for cluster components (kubelets) and lacks automatic rotation, monitoring, and diverse issuer support (e.g., Let's Encrypt, Vault) needed for application workloads.

#### 2. Database Operator (`mongodb-community-operator`)
- **Action**: Migrate from manual `Deployment` manifests to the MongoDB Community Operator.
- **Benefit**:
    - Configuring the custom resource (`MongoDBCommunity`) allows native integration with `cert-manager`.
    - The operator automatically handles the MongoDB configuration for TLS/mTLS, properly mounting keys and setting flags.
- **Steps**:
    - Install Operator.
    - Define `MongoDBCommunity` CRD with `security.tls.enabled: true`.

#### 3. Trust Distribution (`trust-manager`)
- **Action**: Use `trust-manager` (from cert-manager) to distribute the CA bundle to all pods.
- **Benefit**: Ensures all services (backend, jobs) have the up-to-date CA certificate mounted at a standard location (e.g., `/etc/ssl/certs`).

#### Alternative: Service Mesh
- Consider adopting a Service Mesh (Linkerd or Istio) which provides transparent mTLS for all pod-to-pod communication without modifying application code or database config, though this adds significant cluster overhead.
