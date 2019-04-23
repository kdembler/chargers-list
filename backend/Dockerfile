FROM python:3.7-slim
RUN apt-get clean \
    && apt-get -y update
RUN apt-get -y install nginx \
    && apt-get -y install build-essential
COPY . /app
WORKDIR /app
RUN mv prod_config/nginx.conf /etc/nginx/sites-enabled/
RUN chmod +x prod_config/start.sh
RUN pip3 install -r requirements.txt
RUN pip3 install uwsgi
EXPOSE 5000
CMD ["prod_config/start.sh"]
