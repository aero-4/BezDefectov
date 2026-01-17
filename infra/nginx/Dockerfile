# ---- frontend ----
FROM node:20-alpine AS frontend_build

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend .

RUN npx vite build


# ---- nginx ----
FROM nginx:alpine

RUN apk add --no-cache gettext

COPY --from=frontend_build /app/frontend/dist /usr/share/nginx/html

COPY infra/nginx/nginx.conf.template /etc/nginx/nginx.conf.template
COPY infra/nginx/nginx.prod.conf.template /etc/nginx/nginx.prod.conf.template
COPY infra/nginx/nginx.test.conf.template /etc/nginx/nginx.test.conf.template
COPY infra/nginx/nginx.dev.conf.template /etc/nginx/nginx.dev.conf.template
COPY infra/nginx/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
