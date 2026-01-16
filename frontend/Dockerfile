FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx vite build

CMD ["npx", "vite", "preview", "--host", "0.0.0.0"]



