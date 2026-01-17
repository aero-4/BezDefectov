#!/bin/sh
set -eu

: "${DOMAIN:=migom.shop}"
: "${API_DOMAIN:=api.migom.shop}"

# ensure directories exist
mkdir -p /var/www/certbot
mkdir -p /etc/letsencrypt/live/${DOMAIN}

# if real cert not present — generate a short-lived dummy cert so nginx can start
DUMMY_CERT="/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"
if [ ! -f "$DUMMY_CERT" ]; then
  echo "Creating dummy cert for ${DOMAIN}"
  apk add --no-cache openssl >/dev/null 2>&1 || true
  openssl req -x509 -nodes -newkey rsa:2048 \
    -days 1 \
    -keyout /etc/letsencrypt/live/${DOMAIN}/privkey.pem \
    -out /etc/letsencrypt/live/${DOMAIN}/fullchain.pem \
    -subj "/CN=${DOMAIN}"
fi

# if there is a real final config template, render it; otherwise use init config
if [ -f /etc/nginx/nginx.ssl.conf.template ]; then
  envsubst '$DOMAIN $API_DOMAIN' < /etc/nginx/nginx.ssl.conf.template > /etc/nginx/nginx.conf
else
  cp /etc/nginx/nginx.init.conf /etc/nginx/nginx.conf
fi

# start nginx in background
nginx -g 'daemon off;' &

# background loop: wait for real cert(s) and then reload nginx with ssl config
while true; do
  if [ -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ] && \
     [ "$(stat -c %s /etc/letsencrypt/live/${DOMAIN}/fullchain.pem)" -gt 0 ]; then
    # real cert exists — ensure ssl config is active
    envsubst '$DOMAIN $API_DOMAIN' < /etc/nginx/nginx.ssl.conf.template > /etc/nginx/nginx.conf
    nginx -s reload || true
    break
  fi
  sleep 2
done

# foreground wait so container doesn't exit
wait
