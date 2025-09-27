# MongoDB Deployment & Backup Guide (Hostinger VPS)

## Overview

This guide walks you through deploying MongoDB on a Hostinger VPS (Ubuntu 22.04+) and setting up an automated backup system. It configures hourly backups for the `tariqul` database and retains a maximum of 5 backups locally or optionally uploads them to AWS S3.

## Prerequisites

- **Hostinger VPS** (Ubuntu 22.04 or later)
- **MongoDB installed**
- **Environment variables**: MongoDB username and password
- **Optional**: AWS S3 bucket + AWS CLI (for offsite backup)

---

## Step 0: Get Access to Remote Server:

- **Log in to VPS**:

```bash
ssh root@your-vps-ip
```

- **Update System:**

```bash
sudo apt update && sudo apt upgrade -y
```

---

## Step 1: Install and Configure MongoDB

### 1.1 Install MongoDB and enable service

```bash
sudo apt-get install gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg \
   --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 1.2 Secure MongoDB

Security is crucial, especially in a production environment. Follow these steps to secure your MongoDB installation.

#### Create an Admin User:

Open the MongoDB shell:

```
mongosh
```

Switch to the admin database:

```
use admin
```

Create an admin user:

```
db.createUser({user: "username" , pwd: passwordPrompt() , roles: ["root"]})
```

Verify Users:

```
show users
```

Create New User with Read & Write Permission and New Database

```
use database_name
db.createUser({user:"username", pwd:passwordPrompt(), roles:[{role:"readWrite", db:"database_name"}]})
```

Verify Users:

```
show users
```

Exit the shell:

```
exit
```

#### Enable Authentication:

Open the MongoDB configuration file

```
sudo nano /etc/mongod.conf
```

Look for the `security` section and add the following:

```
security:
authorization: enabled
```

## Step 2: Configure MongoDB for Production

MongoDB's default settings are not optimized for production. Let's make some tweaks.

### Limit Bind IP:

Open the MongoDB configuration file:

```
sudo nano /etc/mongod.conf
```

Find the `net` section and set `bindIp` to your server's IP address and localhost:

```
net:
bindIp: 127.0.0.1
```

### Set Up a Firewall:

Enable UFW

```
sudo ufw enable
```
