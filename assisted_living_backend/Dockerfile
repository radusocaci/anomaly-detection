FROM maven:3.6.3-jdk-11 AS builder

COPY ./src/ /root/src
COPY ./pom.xml /root/
COPY ./checkstyle.xml /root/
WORKDIR /root
RUN mvn package
RUN java -Djarmode=layertools -jar /root/target/medication-system-0.0.1-SNAPSHOT.jar list
RUN java -Djarmode=layertools -jar /root/target/medication-system-0.0.1-SNAPSHOT.jar extract
RUN ls -l /root

FROM openjdk:11.0.6-jre

ENV TZ=UTC
ENV DB_IP=ec2-52-213-167-210.eu-west-1.compute.amazonaws.com
ENV DB_PORT=5432
ENV DB_USER=xjptduzdxzapmd
ENV DB_PASSWORD=aeb5e2a6a7b9b96b803c91c3e7f45b8dc1f1b7024173c060d64d93c8aa6fe513
ENV DB_DBNAME=dclijblilrbvh0

COPY --from=builder /root/dependencies/ ./
COPY --from=builder /root/snapshot-dependencies/ ./

RUN sleep 10
COPY --from=builder /root/spring-boot-loader/ ./
COPY --from=builder /root/application/ ./
ENTRYPOINT ["java", "org.springframework.boot.loader.JarLauncher","-XX:+UseContainerSupport -XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap -XX:MaxRAMFraction=1 -Xms512m -Xmx512m -XX:+UseG1GC -XX:+UseSerialGC -Xss512k -XX:MaxRAM=72m"]
