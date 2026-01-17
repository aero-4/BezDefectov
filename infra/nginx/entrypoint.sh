#!/bin/sh
set -eu

: "${DOMAIN:=migom.shop}"
: "${API_DOMAIN:=api.migom.shop}"

# render init (HTTP-only) config
envsubst '$DOMAIN $API_DOMAIN' < /etc/nginx/nginx.init.conf > /etc/nginx/nginx.conf

# background watcher: when real cert appears, switch to SSL config and reload
(
  while true; do
    if [ -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ] && [ -s "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
      envsubst '$DOMAIN $API_DOMAIN' < /etc/nginx/nginx.ssl.conf.template > /etc/nginx/nginx.conf
      nginx -s reload || true
      break
    fi
    sleep 2
  done
) &

# run nginx as PID 1 in foreground
exec nginx -g 'daemon off;'
