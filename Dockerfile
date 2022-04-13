FROM node:14.18-alpine AS build

RUN apk update && apk upgrade && rm -f /var/cache/apk/*
RUN yarn global add @vue/cli

ADD . /nft-armory/
WORKDIR /nft-armory
RUN yarn install && yarn build

# run image
FROM abhin4v/hastatic:latest
COPY --from=build /nft-armory/dist /var/www
WORKDIR /var/www
CMD ["/usr/bin/hastatic"]
