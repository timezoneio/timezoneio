FROM google/nodejs

RUN npm install -g npm
RUN npm install -g nodemon

WORKDIR /app
ADD package.json /app/package.json
ONBUILD RUN npm install
ADD . /app

EXPOSE 8080
CMD nodemon -L index.js
