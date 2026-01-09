#!/bin/sh

# Generate config.js
echo "Generating config.js..."
cat <<EOF > /usr/share/nginx/html/meeting/config.js
window.ENV = {
  REACT_APP_CLIENT_ID: "${REACT_APP_CLIENT_ID}",
  REACT_APP_BASE_PATH: "${REACT_APP_BASE_PATH}",
  REACT_APP_API_URL: "${REACT_APP_API_URL}",
  REACT_APP_URL: "${REACT_APP_URL}",
  REACT_APP_SENTRY_DSN: "${REACT_APP_SENTRY_DSN}"
};
EOF

# Execute CMD
exec "$@"
