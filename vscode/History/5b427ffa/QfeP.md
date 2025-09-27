## সংক্ষিপ্ত বিবরণ

এই ডকুমেন্টেশনটি Hostinger VPS-এ Express.js ব্যাকএন্ড ডিপ্লয় করার ধাপে ধাপে নির্দেশনা প্রদান করে। এটি naturalsefa.com ডোমেইনের জন্য API এন্ডপয়েন্ট (/api) সেটআপ করে। মূল ডোমেইন (naturalsefa.com) একটি প্রধান ওয়েবসাইট হোস্ট করে। Nginx, PM2, এবং গিটহাব অ্যাকশন ব্যবহার করা হয়েছে।

## প্রয়োজনীয়তা

- **Hostinger VPS**: Ubuntu 22.04 বা তার উপরের ভার্সন, SSH অ্যাক্সেস সহ।
- **ডোমেইন**: naturalsefa.com.
- **গিটহাব রিপোজিটরি**: Express.js প্রজেক্ট হোস্ট করা।
- **Environment Variables**: PORT এবং অন্যান্য API-সম্পর্কিত কী।
- **টুলস**: SSH ক্লায়েন্ট, Git, টেক্সট এডিটর।
- **প্রি-ইনস্টলড সফটওয়্যার:** `Node.js (v18.17+)` `Nginx` `PM2`
- **গিটহাব সিক্রেটস:**
- VPS_IP: VPS-এর পাবলিক IP
- VPS_USERNAME: VPS-এর ইউজারনেম
- SSH_PRIVATE_KEY: SSH প্রাইভেট কী
- SSH_PASSPHRASE: SSH কী-এর পাসফ্রেজ (যদি থাকে)

---

## ধাপসমূহ

### ধাপ ১: VPS সেটআপ

- **VPS-এ লগইন:**

```bash
ssh root@your-vps-ip
```

- **প্রয়োজনীয় সফটওয়্যার ইনস্টল:**
- Node.js:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

- Nginx:

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
```

- PM2:

```bash
sudo npm install -g pm2
```

- Git:

```bash
sudo apt install git -y
```

---

### ধাপ ২: ডোমেইন DNS সেটআপ

- Hostinger-এর DNS সেটিংসে যান।
- নিচের রেকর্ড যোগ করুন:

```bash
Type: A
Name: @
Value: your-vps-ip
TTL: 14400

Type: A
Name: www
Value: your-vps-ip
TTL: 14400
```

- DNS প্রোপাগেশনের জন্য ২৪ ঘণ্টা পর্যন্ত অপেক্ষা করুন।

---

### ধাপ ৩: Express.js প্রজেক্ট ডিপ্লয়

#### 2.1: naturalsefa.com

- **প্রজেক্ট ক্লোন:**

```bash
mkdir -p ~/apps/naturalsefa/server
cd ~/apps/naturalsefa/server
git clone git@github.com:yourusername/naturalsefa-backend-repo.git .
```

- **Environment Variables:**

```bash
nano ~/apps/naturalsefa/server/.env
```

```env
PORT=4000
```

- **বিল্ড এবং রান:**

```bash
npm install
pm2 start index.js --name "naturalsefa-backend"
pm2 save
pm2 startup
```

---

### ধাপ ৪: গিটহাব অ্যাকশন সেটআপ

- **naturalsefa-backend রিপোজিটরির জন্য:**

```bash
mkdir -p .github/workflows
nano .github/workflows/deploy.yml
```

```yaml
name: Deploy Express.js to VPS
on:
  push:
    branches:
      - main
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v3
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_IP }}
          username: ${{ secrets.VPS_USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          passphrase: ${{ secrets.SSH_PASSPHRASE }}
          script: |
            cd ~/apps/naturalsefa/server
            git pull origin main
            npm install
            pm2 restart naturalsefa-backend
```

- **tariqul-backend রিপোজিটরির জন্য:**

```bash
mkdir -p .github/workflows
nano .github/workflows/deploy.yml
```

```yaml
name: Deploy Express.js to VPS
on:
  push:
    branches:
      - main
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v3
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_IP }}
          username: ${{ secrets.VPS_USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          passphrase: ${{ secrets.SSH_PASSPHRASE }}
          script: |
            cd ~/apps/tariqul/server
            git pull origin main
            npm install
            pm2 restart tariqul-backend
```

- **গিটহাব সিক্রেটস:**
  - Settings > Secrets > Actions সেকশনে:
    - VPS_IP: 203.0.113.10
    - VPS_USERNAME: root
    - SSH_PRIVATE_KEY: SSH প্রাইভেট কী
    - SSH_PASSPHRASE: পাসফ্রেজ (যদি থাকে)

---

### ধাপ ৫: Nginx কনফিগারেশন

#### naturalsefa.com:

```bash
sudo nano /etc/nginx/sites-available/naturalsefa.com
```

```nginx
server {
    listen 80;
    server_name naturalsefa.com www.naturalsefa.com tariqul.naturalsefa.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name naturalsefa.com tariqul.naturalsefa.com;
    ssl_certificate /etc/letsencrypt/live/naturalsefa.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/naturalsefa.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 443 ssl;
    server_name www.naturalsefa.com;
    ssl_certificate /etc/letsencrypt/live/naturalsefa.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/naturalsefa.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    return 301 https://naturalsefa.com$request_uri;
}
```

#### tariqul.com:

```bash
sudo nano /etc/nginx/sites-available/tariqul.com
```

```nginx
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

    location /api {
        proxy_pass http://localhost:4001;
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
```

- **সাইট এনাবল এবং রিস্টার্ট:**

```bash
sudo ln -s /etc/nginx/sites-available/naturalsefa.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/tariqul.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### ধাপ ৬: SSL সার্টিফিকেট সেটআপ

- **Certbot ইনস্টল:**

```bash
sudo apt install certbot python3-certbot-nginx -y
```

- **SSL সার্টিফিকেট তৈরি:**

  - naturalsefa.com:
    ```bash
    sudo certbot --nginx -d naturalsefa.com -d www.naturalsefa.com -d tariqul.naturalsefa.com
    ```
  - tariqul.com:
    ```bash
    sudo certbot --nginx -d tariqul.com -d www.tariqul.com
    ```

- **অটো-রিনিউয়াল চেক:**

```bash
sudo certbot renew --dry-run
```

---

### ধাপ ৭: টেস্টিং

- **API এন্ডপয়েন্ট:**
  - ব্রাউজারে বা Postman-এ চেক করুন:
    - https://naturalsefa.com/api
    - https://tariqul.com/api
- **গিটহাব অ্যাকশন:**

```bash
git add .
git commit -m "Test auto-deploy"
git push origin main
```

- **গিটহাব Actions ট্যাবে স্ট্যাটাস চেক করুন।**
- **VPS-এ ফাইল চেক:**

```bash
ls -la ~/apps/naturalsefa/server
ls -la ~/apps/tariqul/server
```

---

### সমস্যা সমাধান

- **গিটহাব অ্যাকশন ত্রুটি:**
  - Actions ট্যাবে লগ চেক করুন।
- **SSH কী চেক:**

```bash
ssh -i ~/.ssh/id_rsa your_vps_username@your_vps_ip
```

- **Nginx ত্রুটি:**

```bash
sudo tail -f /var/log/nginx/error.log
```

- **PM2 ত্রুটি:**

```bash
pm2 logs naturalsefa-backend
pm2 logs tariqul-backend
```

---

### সিকিউরিটি সুপারিশ

- SSH: Password-এর পরিবর্তে SSH key ব্যবহার করুন।
- Root লগইন: `/etc/ssh/sshd_config`-এ `PermitRootLogin no` সেট করুন।
- মনিটরিং: UptimeRobot দিয়ে API মনিটর করুন।

---

### রেফারেন্স

- Express.js ডকুমেন্টেশন
- গিটহাব অ্যাকশন ডকুমেন্টেশন
- Nginx ডকুমেন্টেশন

---

**পরিশিষ্ট**

- তারিখ: ৮ জুলাই, ২০২৫
- লেখক: Tariqul Islam
- যোগাযোগ: প্রশ্ন থাকলে Hostinger সাপোর্ট বা ডেভেলপারের সাথে যোগাযোগ করুন।
