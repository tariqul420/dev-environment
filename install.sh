#!/bin/bash
set -euo pipefail

# helpers
say() { printf "\n\033[1;36m%s\033[0m\n" "🔹 $*"; }
ok()  { printf "\033[1;32m%s\033[0m\n" "✅ $*"; }
warn(){ printf "\033[1;33m%s\033[0m\n" "⚠️  $*"; }

# repo root
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"

say "Updating system..."
sudo apt update && sudo apt -y upgrade

say "Installing essentials..."
sudo apt install -y --no-install-recommends \
  curl wget git rsync build-essential apt-transport-https ca-certificates \
  gnupg lsb-release unzip

# Node.js (LTS)
say "Installing Node.js (LTS)..."
if ! command -v node >/dev/null 2>&1; then
  set +e
  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
  sudo apt install -y nodejs
  if [ $? -eq 0 ]; then
    ok "Node.js installed successfully ($(node -v))"
  else
    warn "NodeSource repository failed, trying snap..."
    sudo snap install node --classic || warn "Node.js installation failed"
  fi
  set -e
else
  ok "Node.js already installed ($(node -v))"
fi

# GNOME tooling
say "Installing GNOME tools (extensions CLI + tweaks + manager)..."
sudo apt install -y gnome-shell-extensions gnome-shell-extension-prefs gnome-tweaks
sudo apt install -y gnome-shell-extension-manager || true

if [ -f "${SCRIPT_DIR}/gnome/extensions.txt" ]; then
  say "Restoring GNOME enabled extensions (if installed)..."
  if command -v gnome-extensions >/dev/null 2>&1; then
    xargs -n1 -r gnome-extensions enable < "${SCRIPT_DIR}/gnome/extensions.txt" || true
  else
    warn "gnome-extensions CLI not found; skipping enable step."
  fi
fi

# Oh My Posh + fonts
say "Installing Oh My Posh..."
if ! command -v oh-my-posh >/dev/null 2>&1; then
  set +e
  curl -s https://ohmyposh.dev/install.sh | bash -s
  if [ $? -ne 0 ]; then
    warn "Oh My Posh installation failed, trying manual download..."
    sudo wget https://github.com/JanDeDobbeleer/oh-my-posh/releases/latest/download/posh-linux-amd64 -O /usr/local/bin/oh-my-posh
    sudo chmod +x /usr/local/bin/oh-my-posh
  fi
  set -e
fi
mkdir -p ~/.poshthemes
if [ -d "${SCRIPT_DIR}/posh/themes" ]; then
  rsync -a "${SCRIPT_DIR}/posh/themes/" ~/.poshthemes/
fi

say "Installing FiraCode / Nerd fonts (for prompt glyphs)..."
sudo apt install -y fonts-firacode fonts-powerline || true
mkdir -p ~/.local/share/fonts

# Install JetBrains Mono Nerd Font
if [ ! -f ~/.local/share/fonts/JetBrainsMonoNLNerdFont-Regular.ttf ]; then
  TMPF="$(mktemp -d)"
  set +e
  wget -qO "$TMPF/JBMNF.zip" "https://github.com/ryanoasis/nerd-fonts/releases/download/v3.2.1/JetBrainsMono.zip"
  if [ $? -eq 0 ] && unzip -qq "$TMPF/JBMNF.zip" -d "$TMPF/jbm" 2>/dev/null; then
    find "$TMPF/jbm" -name "*NerdFont*.ttf" -exec cp {} ~/.local/share/fonts/ \; 2>/dev/null || true
    fc-cache -f >/dev/null 2>&1 || true
    ok "JetBrains Mono Nerd Font installed"
  else
    warn "Failed to download JetBrains Mono Nerd Font"
  fi
  set -e
  rm -rf "$TMPF"
else
  ok "JetBrains Mono Nerd Font already installed"
fi

# VS Code
say "Installing VS Code..."
if ! command -v code >/dev/null 2>&1; then
  # Create temporary file for GPG key
  TEMP_GPG=$(mktemp)
  if wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > "$TEMP_GPG"; then
    sudo install -o root -g root -m 644 "$TEMP_GPG" /usr/share/keyrings/packages.microsoft.gpg
    echo "deb [arch=amd64,arm64,armhf signed-by=/usr/share/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" \
      | sudo tee /etc/apt/sources.list.d/vscode.list >/dev/null
    sudo apt update
    sudo apt install -y code
    ok "VS Code installed successfully"
  else
    warn "Failed to install VS Code via APT, trying snap..."
    sudo snap install --classic code || warn "VS Code installation failed completely"
  fi
  rm -f "$TEMP_GPG"
else
  ok "VS Code already installed"
fi
mkdir -p ~/.config/Code/User

# Fish shell
say "Installing Fish shell..."
sudo apt install -y fish
if [ "$(getent passwd "$USER" | cut -d: -f7)" != "/usr/bin/fish" ]; then
  set +e
  chsh -s /usr/bin/fish "$USER"
  if [ $? -eq 0 ]; then
    ok "Default shell changed to Fish"
  else
    warn "Could not change default shell automatically"
    warn "Please run manually after installation: chsh -s /usr/bin/fish $USER"
  fi
  set -e
else
  ok "Fish shell already set as default"
fi

# MongoDB Compass
say "Installing MongoDB Compass..."
if ! command -v mongodb-compass >/dev/null 2>&1; then
  COMPASS_DEB="mongodb-compass_amd64.deb"
  set +e
  wget -qO "$COMPASS_DEB" https://downloads.mongodb.com/compass/mongodb-compass-latest-amd64.deb
  if [ $? -eq 0 ]; then
    sudo apt install -y ./"$COMPASS_DEB"
    if [ $? -eq 0 ]; then
      ok "MongoDB Compass installed successfully"
    else
      warn "DEB install failed, trying snap..."
      sudo snap install mongodb-compass || warn "Compass snap install also failed"
    fi
  else
    warn "Failed to download MongoDB Compass, trying snap..."
    sudo snap install mongodb-compass || warn "Compass installation failed completely"
  fi
  set -e
  rm -f "$COMPASS_DEB" 2>/dev/null || true
else
  ok "MongoDB Compass already installed"
fi

# pgAdmin 4
say "Installing pgAdmin 4..."
if ! command -v pgadmin4 >/dev/null 2>&1 && ! command -v pgadmin4-desktop >/dev/null 2>&1; then
  set +e
  curl -fsSL https://www.pgadmin.org/static/packages_pgadmin_org.pub | sudo gpg --dearmor -o /usr/share/keyrings/pgadmin-keyring.gpg
  if [ $? -eq 0 ]; then
    echo "deb [signed-by=/usr/share/keyrings/pgadmin-keyring.gpg] https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" \
      | sudo tee /etc/apt/sources.list.d/pgadmin4.list >/dev/null
    sudo apt update
    sudo apt install -y pgadmin4-desktop pgadmin4-web
    ok "pgAdmin 4 installed successfully"
  else
    warn "Failed to add pgAdmin repository, trying snap..."
    sudo snap install pgadmin4 || warn "pgAdmin installation failed"
  fi
  set -e
else
  ok "pgAdmin already installed"
fi

# Firefox
say "Installing Firefox..."
if ! command -v firefox >/dev/null 2>&1; then
  set +e
  sudo apt install -y firefox
  if [ $? -ne 0 ]; then
    warn "APT Firefox install failed, trying snap..."
    sudo snap install firefox || warn "Firefox installation failed"
  else
    ok "Firefox installed successfully"
  fi
  set -e
else
  ok "Firefox already installed"
fi

# Google Chrome
say "Installing Google Chrome..."
if ! command -v google-chrome >/dev/null 2>&1; then
  set +e
  # Add Google's signing key
  wget -qO- https://dl.google.com/linux/linux_signing_key.pub | sudo gpg --dearmor -o /usr/share/keyrings/google-chrome-keyring.gpg
  if [ $? -eq 0 ]; then
    # Add Google Chrome repository
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" \
      | sudo tee /etc/apt/sources.list.d/google-chrome.list >/dev/null
    sudo apt update
    sudo apt install -y google-chrome-stable
    ok "Google Chrome installed successfully"
  else
    warn "Failed to add Google Chrome repository"
    # Try downloading DEB directly
    CHROME_DEB="google-chrome-stable_current_amd64.deb"
    if wget -qO "$CHROME_DEB" https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb; then
      sudo apt install -y ./"$CHROME_DEB"
      rm -f "$CHROME_DEB"
      ok "Google Chrome installed via DEB package"
    else
      warn "Google Chrome installation failed completely"
    fi
  fi
  set -e
else
  ok "Google Chrome already installed"
fi

# Restore dotfiles/configs
say "Restoring dotfiles & configs..."
mkdir -p ~/.config ~/.themes ~/.icons
[ -f  "${SCRIPT_DIR}/git/.gitconfig" ] && cp "${SCRIPT_DIR}/git/.gitconfig" ~/.gitconfig
[ -d "${SCRIPT_DIR}/shell/fish"     ] && rsync -a "${SCRIPT_DIR}/shell/fish/" ~/.config/fish/
[ -d "${SCRIPT_DIR}/vscode"         ] && rsync -a "${SCRIPT_DIR}/vscode/" ~/.config/Code/User/
[ -d "${SCRIPT_DIR}/themes"         ] && rsync -a "${SCRIPT_DIR}/themes/" ~/.themes/
[ -d "${SCRIPT_DIR}/icons"          ] && rsync -a "${SCRIPT_DIR}/icons/" ~/.icons/

# Installation Summary
say "Installation Summary:"
echo "🟢 System updated and essential packages installed"
command -v node >/dev/null 2>&1 && echo "🟢 Node.js: $(node -v)" || echo "🔴 Node.js: Failed"
command -v code >/dev/null 2>&1 && echo "🟢 VS Code: Installed" || echo "🔴 VS Code: Failed"
command -v fish >/dev/null 2>&1 && echo "🟢 Fish Shell: Installed" || echo "🔴 Fish Shell: Failed"
command -v oh-my-posh >/dev/null 2>&1 && echo "🟢 Oh My Posh: Installed" || echo "🔴 Oh My Posh: Failed"
command -v firefox >/dev/null 2>&1 && echo "🟢 Firefox: Installed" || echo "🔴 Firefox: Failed"
command -v google-chrome >/dev/null 2>&1 && echo "🟢 Google Chrome: Installed" || echo "🔴 Google Chrome: Failed"
command -v mongodb-compass >/dev/null 2>&1 && echo "🟢 MongoDB Compass: Installed" || echo "🔴 MongoDB Compass: Failed"
(command -v pgadmin4 >/dev/null 2>&1 || command -v pgadmin4-desktop >/dev/null 2>&1) && echo "🟢 pgAdmin 4: Installed" || echo "🔴 pgAdmin 4: Failed"
[ -d ~/.themes ] && echo "🟢 Themes: Restored" || echo "🔴 Themes: Not found"
[ -d ~/.icons ] && echo "🟢 Icons: Restored" || echo "🔴 Icons: Not found"
[ -f ~/.config/fish/config.fish ] && echo "🟢 Fish Config: Restored" || echo "🔴 Fish Config: Not found"
[ -f ~/.config/Code/User/settings.json ] && echo "🟢 VS Code Settings: Restored" || echo "🔴 VS Code Settings: Not found"

ok "Setup complete! 🔁 Please log out/in (or reboot) to apply Fish default shell, fonts & GNOME tweaks."