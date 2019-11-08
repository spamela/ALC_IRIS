# Docker container for Apache2-PHP server to run Docker

This Docker container enables to run an Apache2-PHP server that can deploy other containers.

The Dockerfile was built by combining two different cases, namely Apache2-PHP and Docker-in-Docker.
The original Dockerfiles can be found in
- Apache2-PHP from: https://github.com/jpetazzo/dind.git
- Docker-in-Docker (DinD) from: https://github.com/alfg/docker-php-apache.git

Install Docker on Ubuntu, and as root, build and run the container as:

docker build -t web_front .
docker container run --privileged --name web_front -v /var/run/docker.sock:/var/run/docker.sock -p 8080:80 -d web_front

Then, you can access the web-page by going to:
<IP-address>:8080/



