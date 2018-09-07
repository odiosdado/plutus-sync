FROM openjdk:8-jdk-alpine
ADD /target/plutus-sync-*.jar plutus-sync.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","-Dspring.profiles.active=production","/plutus-sync.jar"]