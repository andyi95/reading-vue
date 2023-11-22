FROM node:17-alpine as build-stage

WORKDIR /app


COPY package*.json ./

RUN apk update && apk add -u openssl apk-tools zlib busybox

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.17-alpine

COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]