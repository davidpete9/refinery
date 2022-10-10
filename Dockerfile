FROM openjdk:17-jdk-slim
RUN mkdir /app
COPY buildSrc/build/libs/buildSrc.jar /app

