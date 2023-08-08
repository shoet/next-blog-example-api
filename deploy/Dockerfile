# build stage #########
FROM node:18 as builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# runtime stage #########
FROM node:18 as runtime

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

EXPOSE 3000

CMD ["node", "dist/server.js"]
