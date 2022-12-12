FROM node:6.2-slim

RUN mkdir -p /app
WORKDIR /app
COPY . /app/
ENV NODE_ENV production
RUN npm install

EXPOSE 8888

CMD ["node", "./index.js"]
