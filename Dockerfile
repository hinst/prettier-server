FROM node:26

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY app.js .

EXPOSE 3000

CMD ["node", "app.js"]
