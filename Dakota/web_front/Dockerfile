FROM alpine:3.10
# --- Combined Dockerfile to include both Apache2-PHP from
# https://github.com/jpetazzo/dind.git
# and Docker-in-Docker (DinD) from
# https://github.com/alfg/docker-php-apache.git
MAINTAINER stanislas.pamela@ukaea.uk

# Install the magic wrapper.
ADD ./wrapdocker /usr/local/bin/wrapdocker

# Install Docker and dependencies
RUN apk --update add \
  bash \
  iptables \
  ca-certificates \
  e2fsprogs \
  docker \
  curl \
  php-apache2 php-cli php-json php-mbstring php-phar php-openssl \
  && chmod +x /usr/local/bin/wrapdocker \
  && rm -rf /var/cache/apk/* \
  && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
  && mkdir -p /var/www/html/ && chown -R apache:apache /var/www/html

COPY www/ /var/www/html/
COPY etc/apache2/httpd.conf /etc/apache2/httpd.conf
COPY etc/apache2/sites/ /etc/apache2/sites/
COPY etc/php/php.ini /etc/php7/php.ini
COPY entrypoint.sh /opt/entrypoint.sh

EXPOSE 80

# Define additional metadata for our image.
VOLUME /var/lib/docker

#RUN echo "%docker ALL=NOPASSWD: /usr/bin/docker" >> /etc/sudoers
#RUN usermod -u 999 apache \
#    && groupmod -g 999 apache

WORKDIR /var/www/html/
RUN chmod +x /opt/entrypoint.sh
CMD ["wrapdocker"]
ENTRYPOINT [ "/opt/entrypoint.sh" ]

