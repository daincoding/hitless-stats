FROM node:20-alpine
RUN npm i -g serve

WORKDIR /app

COPY . .
RUN npm install

RUN npm run build
EXPOSE 3000
EXPOSE 4173

ENTRYPOINT [ "./entrypoint.sh" ]