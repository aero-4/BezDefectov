#!/bin/sh
set -eu

: "${DOMAIN:=migom.shop}"
: "${API_DOMAIN:=api.migom.shop}"

# 1. стартуем nginx БЕЗ ssl (только http + acme)
envsubst '$DOMAIN $API_DOMAIN' \
  < /etc/nginx/nginx.init.conf \
  > /etc/nginx/nginx.conf

# 2. фоновый watcher сертификата
(
  while true; do
    if [ -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
      echo "SSL cert found, enabling HTTPS"
      envsubst '$DOMAIN $API_DOMAIN' \
        < /etc/nginx/nginx.ssl.conf.template \
        > /etc/nginx/nginx.conf
      nginx -s reload
      break
    fi
    sleep 2
  done
) &

# 3. nginx — PID 1
exec nginx -g 'daemon off;'
