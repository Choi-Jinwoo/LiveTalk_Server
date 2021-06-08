FROM node:15

WORKDIR /usr/src/ask-server
COPY package.json .
RUN npm install
COPY . .

RUN npm run build
CMD node dist/main.js