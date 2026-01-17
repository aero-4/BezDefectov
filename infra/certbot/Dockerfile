# Dockerfile
FROM ubuntu:22.04

EXPOSE 6000 80

# читаем переменные среды из .env
ARG DOMAIN_EMAIL
ARG DOMAIN

# устанавливаем переменные среды в переменные
ENV DOMAIN_EMAIL=$DOMAIN_EMAIL
ENV DOMAIN=$DOMAIN

WORKDIR /certbot

COPY infra/certbot /certbot/

RUN apt-get update && \
    apt-get -y install certbot && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# запускаем скрипт генерации
CMD ["sh", "/generate-certificate.sh"]