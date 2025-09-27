## সংক্ষিপ্ত বিবরণ

এই ডকুমেন্টেশনটি Hostinger VPS-এ React অ্যাপ্লিকেশন ডিপ্লয় করার ধাপে ধাপে নির্দেশনা প্রদান করে। এটি naturalsefa.com ডোমেইনগুলোর জন্য Nginx রিভার্স প্রক্সি এবং PM2 প্রসেস ম্যানেজার ব্যবহার করে। গিটহাব অ্যাকশনের মাধ্যমে স্বয়ংক্রিয় ডিপ্লয়মেন্ট এবং Let’s Encrypt দিয়ে HTTPS সেটআপ অন্তর্ভুক্ত রয়েছে।

## প্রয়োজনীয়তা

- **Hostinger VPS**: Ubuntu 22.04 বা তার উপরের ভার্সন, SSH অ্যাক্সেস সহ।
- **ডোমেইন**: naturalsefa.com, tariqul.naturalsefa.com, এবং tariqul.com, VPS IP-এর সাথে DNS লিঙ্ক করা।
- **গিটহাব রিপোজিটরি**: React প্রজেক্ট হোস্ট করা।
- **Environment Variables**: REACT_APP_SERVER_URL এবং Clerk keys (যদি ব্যবহার করা হয়)।
- **টুলস**: SSH ক্লায়েন্ট (PuTTY/Terminal), Git, টেক্সট এডিটর (nano/vim)।
- **প্রি-ইনস্টলড সফটওয়্যার:** `Node.js (v18.17+)` `Nginx` `PM2`
  - Certbot (Let’s Encrypt)
- **গিটহাব সিক্রেটস:**
- VPS_IP: VPS-এর পাবলিক IP
- VPS_USERNAME: VPS-এর ইউজারনেম
- SSH_PRIVATE_KEY: VPS-এর SSH প্রাইভেট কী
- SSH_PASSPHRASE: SSH কী-এর পাসফ্রেজ (যদি থাকে)

---

## ধাপসমূহ

### ধাপ ১: VPS সেটআপ

- **VPS-এ লগইন:**

```bash
ssh root@your-vps-ip
```

- **সিস্টেম আপডেট:**

```bash
sudo apt update && sudo apt upgrade -y
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

- **ফায়ারওয়াল সেটআপ:**

```bash
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw enable
```

- **SSH কী সেটআপ:**

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

- **প্রাইভেট কী কপি করুন:**

```bash
cat ~/.ssh/id_rsa
```

- **গিটহাবে Settings > Secrets > Actions সেকশনে SSH_PRIVATE_KEY যোগ করুন।**

---

### ধাপ ২: React প্রজেক্ট ডিপ্লয়

#### 2.1: naturalsefa.com

- **প্রজেক্ট ক্লোন:**

```bash
mkdir -p ~/apps/naturalsefa
cd ~/apps/naturalsefa
git clone git@github.com:yourusername/naturalsefa-repo.git .
```

- **Environment Variables:**

```bash
nano ~/apps/naturalsefa/.env
```

```
REACT_APP_SERVER_URL=https://naturalsefa.com/api
REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

- **বিল্ড এবং রান:**

```bash
npm install
npm run build
pm2 start npm --name "naturalsefa-frontend" -- start
pm2 save
pm2 startup
```

---

## যদি auto redeploy করতে চান

### ধাপ ৩: গিটহাব অ্যাকশন সেটআপ

- **naturalsefa রিপোজিটরির জন্য:**

```yaml
mkdir -p .github/workflows
nano .github/workflows/deploy.yml
```

```yaml
name: Deploy React to VPS
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
            cd ~/apps/naturalsefa
            git pull origin main
            npm install
            npm run build
            pm2 restart naturalsefa-frontend
```

- **গিটহাব সিক্রেটস:**
- Settings > Secrets > Actions সেকশনে:
- VPS_IP: 203.0.113.10
- VPS_USERNAME: root
- SSH_PRIVATE_KEY: SSH প্রাইভেট কী
- SSH_PASSPHRASE: পাসফ্রেজ (যদি থাকে)

---

### ধাপ ৪: Nginx কনফিগারেশন

- **naturalsefa.com:**

```bash
sudo nano /etc/nginx/sites-available/naturalsefa.com
```

```nginx
server {
    listen 80;
    server_name naturalsefa.com www.naturalsefa.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name naturalsefa.com;
    ssl_certificate /etc/letsencrypt/live/naturalsefa.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/naturalsefa.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://localhost:3001;
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

- **সাইট এনাবল এবং রিস্টার্ট:**

```bash
sudo ln -s /etc/nginx/sites-available/naturalsefa.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### ধাপ ৫: SSL সার্টিফিকেট সেটআপ

- **Certbot ইনস্টল:**

```bash
sudo apt install certbot python3-certbot-nginx -y
```

- **SSL সার্টিফিকেট তৈরি:**

  - naturalsefa.com:
    ```bash
    sudo certbot --nginx -d naturalsefa.com -d www.naturalsefa.com -d tariqul.naturalsefa.com
    ```

- **অটো-রিনিউয়াল চেক:**

```bash
sudo certbot renew --dry-run
```

---

### ধাপ ৬: ডোমেইন DNS সেটআপ

### ধাপ ৭: টেস্টিং

- **ওয়েবসাইট:**

  - ব্রাউজারে খুলুন:
    - https://naturalsefa.com
  - www ভার্সন রিডাইরেক্ট চেক করুন।

- **গিটহাব অ্যাকশন:**

```bash
git add .
git commit -m "Test auto-deploy"
git push origin main
```

- গিটহাব Actions ট্যাবে স্ট্যাটাস চেক করুন।

- **VPS-এ ফাইল চেক:**

```bash
ls -la ~/apps/naturalsefa
ls -la ~/apps/tariqul
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
pm2 logs naturalsefa-frontend
pm2 logs tariqul-frontend
```

---

### সিকিউরিটি সুপারিশ

- SSH: Password-এর পরিবর্তে SSH key ব্যবহার করুন।
- Root লগইন: `/etc/ssh/sshd_config`-এ `PermitRootLogin no` সেট করুন।
- মনিটরিং: UptimeRobot দিয়ে সাইট মনিটর করুন।

---

### রেফারেন্স

- React ডকুমেন্টেশন
- গিটহাব অ্যাকশন ডকুমেন্টেশন
- Nginx ডকুমেন্টেশন
- Let’s Encrypt

---

**পরিশিষ্ট**

- তারিখ: ৮ জুলাই, ২০২৫
- লেখক: Tariqul Islam
- যোগাযোগ: প্রশ্ন থাকলে Hostinger সাপোর্ট বা ডেভেলপারের সাথে যোগাযোগ করুন।
