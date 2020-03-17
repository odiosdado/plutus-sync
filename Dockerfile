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
COPY --from=build /usr/src/app/target/plutus-api-*.jar /usr/src/app/plutus-api.jar
COPY src/main/resources/application.properties /usr/src/app/application.properties
CMD ["java","-Djava.security.egd=file:/dev/./urandom","-jar","-Dspring.config.additional-location=/usr/src/app/application.properties","plutus-api.jar"]