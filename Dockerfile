FROM openjdk:17-jdk-slim
RUN mkdir /app
COPY subprojects/ /app

