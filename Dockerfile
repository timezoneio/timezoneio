FROM node:0.12.4

ENV NODE_ENV production

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app/
RUN npm install --production
COPY . /app

CMD [ "npm", "start" ]

# package.json requirements
#  "forever": "^0.14.1"
#  "start": "./node_modules/forever/bin/forever ./index.js"
