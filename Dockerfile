FROM google/nodejs

RUN npm install -g npm

WORKDIR /app
ONBUILD RUN npm install

EXPOSE 8080
CMD []
ENTRYPOINT ["/nodejs/bin/npm", "start"]
