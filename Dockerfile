From node:12

WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN npm install
RUN npm audit fix
COPY . /usr/src/app
EXPOSE 3000

ENV MONGO_HOST=mongodb


CMD [ "npm", "start" ]
