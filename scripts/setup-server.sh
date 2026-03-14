#!/bin/bash

# Exit on error
set -e

echo "🚀 Setting up server with ports 22, 80, 443 only..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y nginx curl git ufw fail2ban certbot python3-certbot-nginx

# Configure firewall - ONLY allow ports 22, 80, 443
sudo ufw --force reset
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp comment 'SSH'
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'
sudo ufw --force enable

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -y pm2 -g

# Install Docker (optional)
# curl -fsSL https://get.docker.com -o get-docker.sh
# sudo sh get-docker.sh

# Setup directories
sudo mkdir -p /var/www/techwithpraveen
sudo mkdir -p /var/www/techwithpraveen/logs

# Configure SSH (port 22 security)
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
sudo sed -i 's/#Port 22/Port 22/' /etc/ssh/sshd_config
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# Configure Fail2ban
sudo cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = 22
maxretry = 3
bantime = 86400

[nginx-http-auth]
enabled = true
port = 80,443
maxretry = 5
bantime = 3600
EOF

sudo systemctl restart fail2ban

echo "✅ Server setup complete!"
echo "🔒 Only ports 22, 80, 443 are open"