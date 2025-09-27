# 📦 Docker Complete Guide (A to Z)

## 🚀 What is Docker?

Docker is an **open platform** for developing, shipping, and running applications. It allows you to package applications and their dependencies into a **container** so they can run reliably in different computing environments.

- Containers are **lightweight, fast, and portable** compared to traditional Virtual Machines.
- Docker ensures your app works **the same everywhere** — from your laptop to production servers.

👉 Official Docs: [Docker Overview](https://docs.docker.com/get-started/overview/)

---

## 💻 Installation

### 🔹 Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker
docker --version
```

### 🔹 Mac & Windows

- Install **Docker Desktop**
  👉 [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
  It comes with Docker Engine + Docker Compose + GUI.

---

## 🧰 Basic Docker Commands

| Command                                    | Description                       | Example                                  |
| ------------------------------------------ | --------------------------------- | ---------------------------------------- |
| `docker pull image-name`                   | Pull image from Docker Hub        | `docker pull ubuntu:latest`              |
| `docker images`                            | List all images                   | `docker images`                          |
| `docker run image-name`                    | Run container                     | `docker run ubuntu`                      |
| `docker run -it image-name`                | Run in interactive mode           | `docker run -it ubuntu bash`             |
| `docker stop <container-id>`               | Stop running container            | `docker stop my_container`               |
| `docker start <container-id>`              | Start stopped container           | `docker start my_container`              |
| `docker ps`                                | Show running containers           | `docker ps`                              |
| `docker ps -a`                             | Show all containers               | `docker ps -a`                           |
| `docker rmi image-name`                    | Remove image                      | `docker rmi ubuntu:latest`               |
| `docker rm container-name`                 | Remove container                  | `docker rm my_container`                 |
| `docker run -d image-name`                 | Run in detached (background) mode | `docker run -d nginx`                    |
| `docker run --name custom-name image-name` | Run with custom name              | `docker run --name mydb -d mysql:latest` |
| `docker pull image:version`                | Pull specific version             | `docker pull mysql:5.7`                  |

👉 [Docker Hub Images](https://hub.docker.com/)

---

## 🔑 Environment Variables in Containers

Example: Running MySQL with root password

```bash
docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:8
```

👉 [MySQL Docker Hub](https://hub.docker.com/_/mysql)

---

## 📂 Docker Image Layers

- Docker images are built in **layers**.
- Each instruction in a `Dockerfile` creates a **new read-only layer**.
- Containers are **writable layers** on top of images.

```
Container Layer (Writable)
│
├─ Layer 2
├─ Layer 1
└─ Base Layer (Linux)
```

---

## 🔌 Port Binding

Bind container port to host:

```bash
docker run -p 8080:80 nginx
```

Here:

- `8080` = host port
- `80` = container port

Access: `http://localhost:8080`

---

## 🛠️ Troubleshooting Commands

| Command                                    | Use                     |
| ------------------------------------------ | ----------------------- |
| `docker logs <container-id>`               | View container logs     |
| `docker exec -it <container-id> /bin/bash` | Get shell access (bash) |
| `docker exec -it <container-id> /bin/sh`   | Get shell access (sh)   |

---

## 🆚 Docker vs Virtual Machine

| Docker                        | Virtual Machine                |
| ----------------------------- | ------------------------------ |
| Lightweight, shares OS kernel | Heavy, separate OS for each VM |
| Starts in seconds             | Takes minutes to boot          |
| Uses MBs of memory            | Uses GBs of memory             |
| Great for microservices       | Great for full OS isolation    |

---

## 🖥️ Docker Desktop

- A GUI tool for Windows/Mac to manage containers, images, and networks.
  👉 [What is Docker Desktop?](https://docs.docker.com/desktop/)

---

## 🌐 Docker Networks

Docker uses networks to allow containers to communicate.

| Command                               | Example                     |
| ------------------------------------- | --------------------------- |
| `docker network ls`                   | List networks               |
| `docker network create my_network`    | Create custom network       |
| `docker run --network=my_network ...` | Attach container to network |

Types of Drivers:

- **bridge** (default) → container-to-container on same host
- **host** → shares host networking
- **null** → no networking

👉 [Docker Networking Docs](https://docs.docker.com/network/)

---

## 📦 Example: MongoDB + Mongo Express

Create a network:

```bash
docker network create mongo-network
```

Run MongoDB:

```bash
docker run -d --name mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=secret \
  --network mongo-network \
  mongo
```

Run Mongo Express:

```bash
docker run -d --name mongo-express \
  -e ME_CONFIG_MONGODB_ADMINUSERNAME=admin \
  -e ME_CONFIG_MONGODB_ADMINPASSWORD=secret \
  -p 8081:8081 \
  --network mongo-network \
  mongo-express
```

👉 Access Mongo Express: `http://localhost:8081`

---

## 📜 Docker Compose

Instead of running multiple `docker run` commands, use **Docker Compose**.

### Example `docker-compose.yaml`

```yaml
version: '3'
services:
  mongodb:
    image: mongo
    container_name: mongodb
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=secret
    networks:
      - mongo-network

  mongo-express:
    image: mongo-express
    container_name: mongo-express
    ports:
      - '8081:8081'
    environment:
      - ME_CONFIG_MONGODB_ADMINUSERNAME=admin
      - ME_CONFIG_MONGODB_ADMINPASSWORD=secret
    networks:
      - mongo-network

networks:
  mongo-network:
    driver: bridge
```

### Commands

```bash
docker compose -f docker-compose.yaml up -d
docker compose -f docker-compose.yaml down
```

👉 [Docker Compose Docs](https://docs.docker.com/compose/)

---

## 📝 Dockerfile (Dockerizing Apps)

A **Dockerfile** defines how to build your image.

### Example `Dockerfile`

```dockerfile
# Base Image
FROM node:18

# Set working directory
WORKDIR /app

# Copy files
COPY package*.json ./
RUN npm install

COPY . .

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]
```

### Build & Run

```bash
docker build -t myapp:1.0 .
docker run -p 3000:3000 myapp:1.0
```

👉 [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)

---

## 📤 Push Image to Docker Hub

```bash
docker login
docker tag myapp:1.0 myusername/myapp:1.0
docker push myusername/myapp:1.0
```

👉 [Publish to Docker Hub](https://docs.docker.com/docker-hub/repos/)

---

## 💾 Docker Volumes (Persistent Data)

Types of volumes:

1. **Named Volume**

   ```bash
   docker run -v mydata:/data ubuntu
   ```

2. **Anonymous Volume**

   ```bash
   docker run -v /data ubuntu
   ```

3. **Bind Mount**

   ```bash
   docker run -v /host/path:/container/path ubuntu
   ```

### Manage Volumes

```bash
docker volume ls
docker volume create myvol
docker volume rm myvol
docker volume prune   # remove unused volumes
```

👉 [Docker Volumes Docs](https://docs.docker.com/storage/volumes/)

---

## 📚 References

- 📘 Official Docs: [Docker Docs](https://docs.docker.com/)
- 📺 YouTube Crash Course: [Docker Tutorial](https://www.youtube.com/watch?v=exmSJpJvIPs&t=776s)
- 🐳 Docker Hub: [hub.docker.com](https://hub.docker.com/)

---

✅ This guide covers **everything from installation to Dockerfiles, Compose, Volumes, Networking, and best practices**.

Do you want me to also prepare a **cheat sheet version (1-page summary of commands only)** for quick recall during work?
