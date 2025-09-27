<div align="center">

# � Dev Environment Setup for Ubuntu

*Automated web development environment setup that gets your Ubuntu system ready in minutes*

[![Ubuntu](https://img.shields.io/badge/Ubuntu-20.04%2B-E95420?style=flat-square&logo=ubuntu)](https://ubuntu.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![Shell](https://img.shields.io/badge/shell-fish-4EAA25?style=flat-square&logo=gnu-bash)](https://fishshell.com/)

---

</div>

## 📋 Overview

This repository contains an automated setup script for my web development environment on Ubuntu. It installs and configures all the essential tools, themes, extensions, and configurations needed for a productive development workflow.

**🎯 Goal**: Transform a fresh Ubuntu installation into a fully configured development environment with a single command.

## ✨ Features

### 🛠️ **Development Tools**
- **Node.js (LTS)** - JavaScript runtime with npm package manager
- **Visual Studio Code** - Code editor with custom settings and extensions
- **Git** - Version control with pre-configured `.gitconfig`
- **Fish Shell** - Modern shell with intelligent autocompletion
- **Oh My Posh** - Beautiful and informative shell prompt with icons

### 🌐 **Web Browsers**
- **Firefox** - Open-source web browser with privacy focus
- **Google Chrome** - Feature-rich browser with developer tools

### 🗄️ **Database Tools**
- **MongoDB Compass** - GUI for MongoDB database management
- **pgAdmin 4** - Web-based PostgreSQL administration tool

### ⌨️ **Input Methods**
- **Avro Bangla Keyboard** - Bangla typing support with phonetic layout
- **IBus Integration** - Seamless keyboard switching

### 🎨 **Customization**
- **GNOME Extensions** - Enhanced desktop functionality
- **WhiteSur Themes** - macOS-inspired GTK themes (multiple variants)
- **Custom Icon Packs** - Beautiful icon themes for the desktop
- **Nerd Fonts** - Patched fonts with programming ligatures and icons
- **Oh My Posh Themes** - Custom terminal prompt themes

## � Repository Structure

```
dev-environment/
├── 📜 install.sh              # Main automated setup script
├── 🐚 shell/
│   └── fish/
│       ├── config.fish        # Fish shell configuration
│       └── functions/         # Custom shell functions
├── 💻 vscode/
│   ├── settings.json          # VS Code user settings
│   ├── keybindings.json       # Custom keybindings
│   └── snippets/              # Code snippets
├── � posh/
│   └── themes/
│       └── custom-dev.omp.json # Custom Oh My Posh theme
├── �🎨 themes/                 # GTK themes (WhiteSur variants)
│   ├── WhiteSur-Dark/
│   ├── WhiteSur-Light/
│   └── ... (multiple color variants)
├── 🖼️ icons/                  # Icon themes
│   ├── WhiteSur/
│   ├── Cupertino-Sonoma/
│   └── AZ-OS-3D-Prime-Icons/
└── 📚 README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Fresh Ubuntu installation (20.04 or later)
- Internet connection
- Basic terminal access

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/dev-environment.git
   cd dev-environment
   ```

2. **Make the script executable**
   ```bash
   chmod +x install.sh
   ```

3. **Run the setup script**
   ```bash
   ./install.sh
   ```

4. **Restart your system**
   ```bash
   sudo reboot
   ```

> 💡 **Important**: After installation, log out and log back in (or reboot) to ensure all changes take effect, especially for Fish Shell, fonts, and GNOME theme changes.

## 🧩 GNOME Extensions

The setup includes popular GNOME extensions for enhanced desktop functionality:

- **Dash to Dock** - Customizable dock
- **User Themes** - Enable custom shell themes
- **Tweaks** - Additional customization options
- **Arc Menu** - Application menu replacement
- **Sound Input & Output Device Chooser** - Quick audio device switching

> 📝 **Note**: Some extensions may require manual installation from [extensions.gnome.org](https://extensions.gnome.org/). Check the `gnome/extensions.md` file for detailed installation instructions.

## 🐟 Fish Shell Configuration

### Features
- **Intelligent Autocompletion** - Context-aware suggestions
- **Syntax Highlighting** - Real-time command validation
- **Oh My Posh Integration** - Beautiful, informative prompt with custom themes
- **Custom Functions** - Productivity-enhancing shell functions

### Oh My Posh Themes
The setup includes custom Oh My Posh themes that are automatically restored:
- **Custom Dev Theme** - A developer-focused theme with Git status, Node.js version, and execution time
- **Theme Restoration** - Automatically copies custom themes from `posh/themes/` to `~/.poshthemes/`
- **Fallback Themes** - Downloads default Oh My Posh themes if custom themes aren't found

### Fonts
The setup installs Nerd Fonts (JetBrains Mono, Fira Code, Powerline) with:
- Programming ligatures
- Icon glyphs for terminal display
- Enhanced readability
- Full Unicode support

> 🔧 **Troubleshooting**: If icons don't display correctly in your terminal, ensure you've selected a Nerd Font in your terminal settings (VS Code Terminal, GNOME Terminal, etc.).

## ⌨️ Bangla Input Support

### Avro Bangla Keyboard
- **Phonetic Layout** - Type Bangla using English phonetics
- **IBus Integration** - Seamless keyboard switching (Ctrl+Space)
- **System Integration** - Works across all applications
- **Multiple Fallbacks** - Uses ibus-avro, OpenBangla Keyboard, or Snap package

### Post-Installation Setup
After installation, configure Bangla input:
1. Go to **Settings** → **Region & Language** → **Input Sources**
2. Click **+** to add a new input source
3. Search for **Bangla (Avro)** and add it
4. Use **Super + Space** or **Ctrl + Space** to switch between keyboards

## 🎨 Themes & Customization

### Available Themes
- **WhiteSur** - macOS Big Sur inspired theme
  - Light and Dark variants
  - Multiple accent colors (blue, green, purple, red, orange, pink, yellow)
  - HD and Ultra HD display support

### Icon Themes
- **WhiteSur Icons** - Consistent with the theme
- **Cupertino Sonoma** - macOS Sonoma style icons
- **AZ-OS 3D Prime** - Modern 3D-style icons

## 📷 Screenshots

*Coming soon - Screenshots of the configured desktop, terminal, and VS Code will be added here*

## 🤝 Contributing

Feel free to fork this repository and customize it for your own development setup. If you have improvements or suggestions, pull requests are welcome!

## � Credits

This setup is made possible by these amazing open-source projects:

- [Oh My Posh](https://ohmyposh.dev) - Cross-platform prompt theme engine
- [Fish Shell](https://fishshell.com/) - Smart and user-friendly command line shell
- [WhiteSur GTK Theme](https://github.com/vinceliuice/WhiteSur-gtk-theme) - macOS Big Sur like theme
- [GNOME Extensions](https://extensions.gnome.org/) - Desktop environment enhancements
- [Nerd Fonts](https://www.nerdfonts.com/) - Patched fonts for developers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Happy coding! 🎉**

*If this setup helped you, consider giving it a ⭐*

</div>