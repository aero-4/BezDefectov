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
COPY infra/nginx/nginx.conf /etc/nginx/nginx.conf
COPY infra/nginx/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]