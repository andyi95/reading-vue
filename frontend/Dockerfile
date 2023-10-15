FROM node:17-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

ENV HOST 0.0.0.0

COPY . .

CMD ["npm", "run", "serve"]
