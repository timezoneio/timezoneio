nginx

The nginx config file is located at `/etc/nginx/sites-enabled/default`.

```
server {
    listen 80;

    server_name timezone.io;

    access_log /var/www/timezone.io/log/nginx.access.log;
    error_log /var/www/timezone.io/log/nginx.error.log debug;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
