#!/bin/bash

# чистим папку, где могут находиться старые сертификаты
rm -rf /etc/letsencrypt/live/${DOMAIN}

# выдаем себе сертификат (обратите внимание на переменные среды)
certbot certonly --standalone --email $DOMAIN_EMAIL -d $DOMAIN --cert-name=certfolder --key-type rsa --agree-tos

rm -rf /etc/nginx/cert.pem
rm -rf /etc/nginx/key.pem

# копируем сертификаты из образа certbot в папку Nginx
cp /etc/letsencrypt/live/${DOMAIN}/fullchain.pem /etc/nginx/cert.pem
cp /etc/letsencrypt/live/${DOMAIN}/privkey.pem /etc/nginx/key.pem