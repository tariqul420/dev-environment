#!/bin/bash
DB_NAME=db_name
DB_USER=db_user
DB_PASS=db_password
BACKUP_DIR=/srv/apps/mongodb/backups/$DB_NAME
TIMESTAMP=$(date +%F-%H-%M-%S)
BACKUP_NAME="backup-$DB_NAME-$TIMESTAMP.gz"

mkdir -p $BACKUP_DIR
docker exec mongodb mkdir -p /backups/$DB_NAME

docker exec mongodb mongodump \
  --db $DB_NAME \
  -u $DB_USER \
  -p $DB_PASS \
  --authenticationDatabase $DB_NAME \
  --archive=/backups/$DB_NAME/$BACKUP_NAME --gzip

ls -t $BACKUP_DIR/backup-$DB_NAME-*.gz | tail -n +15 | xargs -r rm --

echo "[$(date '+%F %T')] Backup saved to $BACKUP_DIR/$BACKUP_NAME"