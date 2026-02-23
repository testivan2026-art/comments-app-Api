FROM node:20-alpine

# Встановлюємо mysql-client для wait-for-db
RUN apk add --no-cache mysql-client

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 3000

CMD ["sh", "./wait-for-db.sh"]