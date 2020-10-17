# pull official base image
FROM node:10

# set working directory
WORKDIR /usr/src/app

# copy requirements
COPY ./package.json /usr/src/app/package.json
COPY ./package-lock.json /usr/src/app/package-lock.json

# Updates packages and install git(required for coveralls)
RUN apt-get update
RUN apt-get -y install git

# install dependencies
RUN npm install

# copy app
COPY . /usr/src/app

# expose port
EXPOSE 8080

# docker entrypoint for heroku
CMD ["sh", "./docker-entrypoint.sh"]
