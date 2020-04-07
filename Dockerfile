FROM node:11.9-alpine AS build

WORKDIR /usr/src/app

COPY package*.json .babelrc /usr/src/app/
COPY  ./src /usr/src/app/src

RUN npm install &&\
    npm run build &&\
    npm prune --production

FROM node:11.9-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=build /usr/src/app/dist /usr/src/app/

RUN chown node:node /usr/src/app

USER node
EXPOSE 3000
CMD ["node","index.js"]