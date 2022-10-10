FROM openjdk:17-jdk-slim
RUN mkdir /app
COPY subprojects/build/libs/refinery-language-web-0.0.0-SNAPSHOT-all.jar /app

