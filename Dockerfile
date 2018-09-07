FROM openjdk:8-jdk-alpine
ADD /target/plutus-api-*.jar plutus-api.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","-Dspring.profiles.active=production","/plutus-api.jar"]