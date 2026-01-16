FROM node:20-alpine as frontend_build

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend/ .

RUN npx vite build

# ---- nginx ----
FROM nginx:alpine

RUN apk add --no-cache gettext


COPY --from=frontend_build /app/frontend/dist /app/dist

RUN echo "=== nginx stage: /app ===" && ls -la /app || true
RUN echo "=== nginx stage: /app/dist ===" && ls -la /app/dist || true

COPY infra/nginx/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
