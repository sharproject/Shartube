FROM nginx:stable-alpine


COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir /etc/nginx/sites-available
RUN mkdir /etc/nginx/sites-enabled
COPY app.nginx /etc/nginx/sites-available/
COPY app.nginx /etc/nginx/conf.d/
RUN ln -s /etc/nginx/sites-available/app.nginx /etc/nginx/sites-enabled/app.nginx


EXPOSE 80

