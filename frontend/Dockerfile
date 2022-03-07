FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

ENV HOST 0.0.0.0

EXPOSE 8000

CMD ["npm", "run", "serve"]
