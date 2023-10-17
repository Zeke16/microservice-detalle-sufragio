FROM node:18

WORKDIR /app

COPY package*.json ./

COPY src/database/schemas ./src/database/schemas

RUN npm install

RUN npx prisma generate

COPY ./dist ./src

CMD ["node", "src/main.js"]