FROM node:6.2-slim

RUN mkdir -p /app
WORKDIR /app

RUN npm install -g nodemon

ENV NODE_ENV development

EXPOSE 8888

CMD npm run watch
