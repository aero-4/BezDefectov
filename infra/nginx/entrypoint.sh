#!/bin/sh
set -e

if [ -z "$DOMAIN" ]; then
  echo "ERROR: DOMAIN is not set. Provide DOMAIN via .env or environment."; exit 1
fi

envsubst '$DOMAIN' \
  < /etc/nginx/templates/nginx.conf.template \
  > /etc/nginx/nginx.conf

exec nginx -g 'daemon off;'
