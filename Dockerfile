FROM node:14-alpine AS dev
RUN apk update
RUN apk add git
ARG NODE_ENV=development
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
EXPOSE 3000
ENTRYPOINT ["yarn"]
CMD ["start-local"]
