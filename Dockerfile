### First Stage ###
FROM node:16.14.2 AS builder

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install --force --verbose

COPY . .

# ARG BASE_URL
# ENV REACT_APP_BASE_URL=${BASE_URL}

RUN npm run build

### Second Stage ###
FROM caddy:2.1.1

COPY Caddyfile /etc/caddy/Caddyfile

COPY --from=builder /usr/src/app/build/ /srv

EXPOSE 80

