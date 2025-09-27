## Docker Commands

- docker pull image-name ===> pull form docker hub repository
- docker images ===> see list of docker images
- docker run image-name ===> run docker container using image name
- docker run -it image-name ===> run docker container in inter active mode using docker image name
- docker stop container-name or container-id ===> stop the docker container
- docker start container-name or container-id ===> again run existing docker container
- docker ps ===> see running docker containers
- docker ps -a ===> see all docker containers
- docker rmi image-name ===> remove docker image using image name
- docker rm container-name ===> remove docker container using container name

- docker pull image-name:version ===> pull docker image in specific version
- docker run -d image-name ===> docker run in detach mode(background) using image name
  note: default all container run attach mode
- docker run --name container-name -d image-name => docker container run using custom name

NOTE: We give env in database ex: mysql, mongodb or postgresql use -e tag see docker hub my sql dock. ex:docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:tag

## Docker Image Layers

Container -> Layer 2 -> Layer 1 -> Base Layer (Linux)
Note: All layer is read only layer

## Port Binding

- docker run -p 8080:3306 image-name

## Troubleshoot command

- docker logs container-id
- docker exec -it container-id /bin/bash
- docker exec -it container-id /bin/sh

## Docker vs VM

Application Layer (browser, code editor, etc) -> Host OS Crenel -> Hardware

## Docker Desktop

ex question: what is docker desktop? and other expiation

## Developing with Docker

make a server using docker. using docker image mongo and mongo-express

### Docker Network

docker network is ...

- docker network ls
- docker network create network name

### setting up mongo and mongo express

#### mongo run -d mode, port banding, network mongo network see environment variable ex: MONGO_ROOT_USER=

#### mongo-express

---

## Docker compose

mongodb.yaml for ex: mongodb and mongo-express and network binding

### Docker compose commend

docker compose -f file-name.yaml up -d
docker compose -f file-name.yaml down

---

## Dockerizing our app

test app -> docker image -> docker container

Dockerfile

### important dockerfile instruction

- from
- workdir
- copy
- run
- cmd
- expose
- env

#### command

- docker build -t app-name:tag directory

### push my repo in docker hub

- docker login
- docker push repo-name

--

## Docker volumes

volumes are pu
