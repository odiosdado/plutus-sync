<<<<<<< HEAD
FROM openjdk:8-jdk-alpine as build

ARG MAVEN_VERSION=3.3.9
ARG USER_HOME_DIR="/root" 

ENV MAVEN_HOME /usr/share/maven \
    MAVEN_CONFIG "$USER_HOME_DIR/.m2" \
    # speed up Maven JVM a bit
    MAVEN_OPTS="-XX:+TieredCompilation -XX:TieredStopAtLevel=1"

RUN apk add --no-cache curl tar

RUN mkdir -p /usr/share/maven && \
    curl -fsSL http://apache.osuosl.org/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.tar.gz | tar -xzC /usr/share/maven --strip-components=1 && \
    ln -s /usr/share/maven/bin/mvn /usr/bin/mvn && \
    mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY src /usr/src/app/src 
COPY pom.xml /usr/src/app
RUN mvn -T 1C package

FROM openjdk:8-jdk-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/target/plutus-sync-*.jar /usr/src/app/plutus-sync.jar
CMD ["java","-Djava.security.egd=file:/dev/./urandom","-jar","plutus-sync.jar"]
=======
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
>>>>>>> convert-app-to-node
