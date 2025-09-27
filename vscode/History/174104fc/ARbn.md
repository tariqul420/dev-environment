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

Use UFW (Uncomplicated Firewall) to allow only specific IP addresses to access MongoDB

```
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw deny 27017
```

## Setup MongoDB Backup Script

### Create Backup Directory

```
mkdir -p ~/backups/mongodb
```

### Local Backup Script

Save the following as: `~/backups/mongodb_backup_database_name.sh`

```
#!/bin/bash
BACKUP_DIR=~/backups/mongodb
DB_NAME=database_name
TIMESTAMP=$(date +%F-%H-%M-%S)
BACKUP_NAME="backup-$DB_NAME-$TIMESTAMP.gz"

# Create MongoDB backups
mongodump --db $DB_NAME --authenticationDatabase database_name -u database_user -p your_secure_password --archive=$BACKUP_DIR/$BACKUP_NAME --gzip

# Delete old backups from local directory (keep a maximum of 5)
ls -t $BACKUP_DIR/backup-$DB_NAME-*.gz | tail -n +6 | xargs -I {} rm {}
```

Make it executable:

```
chmod +x ~/backups/mongodb_backup_database_name.sh
```

### [Optional] AWS S3 Backup Script

Ensure AWS CLI is installed and configured.

```
aws configure
```

Modify the backup script to include S3 upload:

```
#!/bin/bash
BACKUP_DIR=~/backups/mongodb
DB_NAME=database_name
TIMESTAMP=$(date +%F-%H-%M-%S)
BACKUP_NAME="backup-$DB_NAME-$TIMESTAMP.gz"
S3_BUCKET="s3://database_name-mongodb-backups"

# Create MongoDB backups
mongodump --db $DB_NAME --authenticationDatabase database_name -u database_user -p your_secure_password --archive=$BACKUP_DIR/$BACKUP_NAME --gzip

# Backup upload to S3
aws s3 cp $BACKUP_DIR/$BACKUP_NAME $S3_BUCKET/$BACKUP_NAME

# Delete old backups from local directory (keep a maximum of 5)
ls -t $BACKUP_DIR/backup-$DB_NAME-*.gz | tail -n +6 | xargs -I {} rm {}

# Delete old backups from S3 (optional, if you want to keep a limited number of backups)
aws s3 ls $S3_BUCKET/ | awk '{print $4}' | grep "backup-$DB_NAME" | sort -r | tail -n +6 | xargs -I {} aws s3 rm $S3_BUCKET/{}
```

## Step 3: Automate Backups with Cron

Edit crontab:

```
crontab -e
```

Add this to run every hour:

```
0 * * * * ~/backups/mongodb_backup_database_name.sh
```

## Step 4: Test & Verify
