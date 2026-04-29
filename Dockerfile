FROM node:17-alpine AS build-env
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --verbose --frozen-lockfile

COPY . ./
RUN yarn build

FROM nginx:1.27.5-alpine-slim
WORKDIR /usr/share/nginx/html

COPY --from=build-env /app/dist/ ./

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
