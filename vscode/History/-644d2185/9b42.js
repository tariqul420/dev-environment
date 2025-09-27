server {
    listen 80;
    server_name tariqul.com www.tariqul.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name tariqul.com;
    ssl_certificate /etc/letsencrypt/live/tariqul.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tariqul.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 443 ssl;
    server_name www.tariqul.com;
    ssl_certificate /etc/letsencrypt/live/tariqul.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tariqul.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    return 301 https://tariqul.com$request_uri;
}