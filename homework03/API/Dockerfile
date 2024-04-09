FROM node:16-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

FROM node:16-alpine AS final
WORKDIR /app
COPY --from=builder ./app/dist ./dist
COPY package.json .
COPY firestore.json .
RUN yarn install --production
EXPOSE 8080
CMD [ "yarn", "start" ]