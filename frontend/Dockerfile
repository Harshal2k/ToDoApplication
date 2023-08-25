from node:latest

WORKDIR /frontend

COPY "package*.json" .

RUN npm install

COPY . .

CMD ["npm" ,"start"]

