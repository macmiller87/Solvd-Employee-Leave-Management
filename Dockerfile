FROM node:20.15.0

WORKDIR /usr/app

COPY package*.json ./

RUN npm install 

COPY . .

EXPOSE 8080

CMD ["npm","run","dev"]