# ---- frontend ----
FROM node:20-alpine AS frontend_build
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npx vite build

# ---- nginx ----
FROM nginx:alpine
RUN apk add --no-cache gettext

# установить рабочую директорию для копирования статик
WORKDIR /usr/share/nginx/html

# копируем dist в текущую рабочую директорию
COPY --from=frontend_build /app/frontend/dist ./

# скопировать entrypoint: путь в COPY — от контекста (в данном случае .)
COPY infra/nginx/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
