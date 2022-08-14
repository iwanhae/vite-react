FROM node:16 as web
WORKDIR /app
COPY package*.json .
RUN npm install
COPY public public
COPY src src
COPY *.* .
RUN npm run build

FROM node:16
WORKDIR /app
COPY server/package*.json .
RUN npm install
COPY server .
RUN npm run build
COPY --from=web /app/dist dist

EXPOSE 3000
CMD npm run start