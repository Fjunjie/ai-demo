# 使用包含 Maven 的 JDK 17 镜像作为基础镜像
FROM maven:3.8.3-openjdk-17-slim AS build

# 设置工作目录
WORKDIR /workspace

# 将 pom.xml 和 src 目录复制到工作目录
COPY pom.xml .
COPY src ./src

# 执行 Maven 打包命令
RUN mvn clean package -DskipTests

# 使用微软的 JDK 17 镜像作为基础镜像
FROM mcr.microsoft.com/openjdk/jdk:17-ubuntu

# 创建一个目录来保存你的应用
WORKDIR /app

# 从构建阶段复制打包好的 jar 文件到新创建的目录中
COPY --from=build /workspace/target/zentransfer-0.0.1-SNAPSHOT.jar /app

ENV TZ=Asia/Shanghai

# 暴露 8087 端口
EXPOSE 8089

# 设置容器启动时运行的命令
CMD ["java", "-jar", "-Dspring.profiles.active=prod","zentransfer-0.0.1-SNAPSHOT.jar"]