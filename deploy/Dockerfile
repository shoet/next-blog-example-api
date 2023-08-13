# ARG GOOGLE_APPLICATION_CREDENTIALS
ARG DB_REPLICA_REMOTE_PATH

# build stage #########
FROM node:18 as builder


WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma
RUN npm install
RUN npx prisma generate

COPY . .

RUN npm run build

# runtime stage #########
FROM node:18 as runtime

# ARG GOOGLE_APPLICATION_CREDENTIALS
ARG DB_REPLICA_REMOTE_PATH

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY package*.json ./
COPY tsconfig.json ./
COPY deploy/entrypoint.sh ./

# COPY .credentials ./.credentials
# ENV GOOGLE_APPLICATION_CREDENTIALS .credentials/.gcp-credentials.json
# ENV GOOGLE_APPLICATION_CREDENTIALS=${GOOGLE_APPLICATION_CREDENTIALS}

RUN npm install

ADD https://github.com/benbjohnson/litestream/releases/download/v0.3.8/litestream-v0.3.8-linux-amd64-static.tar.gz /tmp/litestream.tar.gz
RUN tar -C /usr/local/bin -xzf /tmp/litestream.tar.gz

ENV DB_REPLICA_REMOTE_PATH=$DB_REPLICA_REMOTE_PATH
ENV NODE_ENV="production"
ENV DATABASE_URL="file:./sqlite.db"
ENV TZ="Asia/Tokyo"
ENV APP_PORT="3001"
ENV JWT_SECRET_KEY=$JWT_SECRET_KEY

EXPOSE 3001
RUN chmod +x /usr/src/app/entrypoint.sh
CMD ["/usr/src/app/entrypoint.sh"]
