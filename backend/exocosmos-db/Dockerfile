FROM mysql:8.0

ENV MYSQL_DATABASE=exocosmos
COPY script.sql /docker-entrypoint-initdb.d/

VOLUME /var/lib/mysql
EXPOSE 3306
