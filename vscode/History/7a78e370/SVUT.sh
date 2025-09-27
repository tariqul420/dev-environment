#!/bin/bash
set -e

echo "🔹 Updating system..."
sudo apt update && sudo apt upgrade -y

echo "🔹 Installing essentials..."
sudo apt install -y curl wget git build-essential apt-transport-https ca-certificates gnupg lsb-release

echo "🔹 Installing Node.js (LTS)..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

echo "🔹 Installing VS Code..."
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -o root -g root -m 644 packages.microsoft.gpg /usr/share/keyrings/
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" | sudo tee /etc/apt/sources.list.d/vscode.list
sudo apt update
sudo apt install -y code

echo "🔹 Installing Fish Shell..."
sudo apt install -y fish
chsh -s /usr/bin/fish

echo "🔹 Installing MongoDB Compass..."
wget https://downloads.mongodb.com/compass/mongodb-compass_1.43.3_amd64.deb
sudo apt install -y ./mongodb-compass_1.43.3_amd64.deb

echo "🔹 Installing pgAdmin 4..."
curl https://www.pgadmin.org/static/packages_pgadmin_org.pub | sudo gpg --dearmor -o /usr/share/keyrings/pgadmin-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/pgadmin-keyring.gpg] https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" | sudo tee /etc/apt/sources.list.d/pgadmin4.list
sudo apt update
sudo apt install -y pgadmin4

echo "🔹 Restoring dotfiles..."
cp git/.gitconfig ~/
cp -r shell/fish ~/.config/
cp -r vscode ~/.config/Code/User
[ -d themes ] && cp -r themes ~/.themes
[ -d icons ] && cp -r icons ~/.icons

echo "✅ Setup complete! Reboot or log out/in to apply shell & theme."