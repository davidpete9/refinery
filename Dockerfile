FROM openjdk:17-jdk-slim
RUN mkdir /app
COPY /home/runner/work/refinery/refinery/buildSrc/build/libs/buildSrc.jar /app

