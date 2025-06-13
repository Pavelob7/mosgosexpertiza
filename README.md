# САЙТ:
https://pavelob.ru/  

## Как я деплоил:  
(делал на основе старых заметок https://gist.github.com/Pavelob7/fe4cc9a992c7274f55b7b25aab00fad3)  

Зашел через mRemoteNG на свой VPS  

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

Создал SSH ключи на своем локальном ПК, перенес на VPS и выдал полный доступ:  
На Windows:
```
ssh-keygen -t rsa -b 4096 -C "deploy key"
```

Получаем 2 файла:  
deploy_key  
deploy_key.pub  

На VPS
```
mkdir -p ~/.ssh
root@vps1718190838:~# nano ~/.ssh/authorized_keys // СЮДА УКАЗЫВАЕМ deploy_key.pub
root@vps1718190838:~# chmod 700 ~/.ssh
root@vps1718190838:~# chmod 600 ~/.ssh/authorized_keys
```

Зашел в Github Actions и создал новый workflow:
```
name: Deploy Vue Frontend to VPS

on:
  push:
    branches:
      - master

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Install rsync
        run: sudo apt-get update && sudo apt-get install -y rsync

      - name: Set up Node
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm install

      - name: Build project
        run: npm run build

      - name: Check dist contents
        run: ls -la dist

      - name: Setup SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan -H ${{ secrets.VPS_HOST }} >> ~/.ssh/known_hosts

      - name: Deploy to VPS
        run: |
          rsync -avz --delete dist/ ${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }}:/var/www/pavelob/frontend/dist
```

В Github Settings зашел в Secrets and variables, оттуда уже Actions, там указал секреты:  
SSH_PRIVATE_KEY // Сюда указываем deploy_key  
VPS_HOST // IP сайта  
VPS_PATH // Папка, где проект  
VPS_USER // имя юзера  
 
  
