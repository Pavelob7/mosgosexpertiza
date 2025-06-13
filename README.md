# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).


## Как я деплоил:

Прописал в консоли:  
```sudo nano /etc/nginx/sites-available/default```

В конфиге nginx:
```
server {
    server_name pavelob.ru www.pavelob.ru;

    # Статические файлы фронтенда
    root /var/www/pavelob/frontend/dist;  # Путь к собранному Vue-проекту
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/pavelob.ru/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/pavelob.ru/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}
```

  