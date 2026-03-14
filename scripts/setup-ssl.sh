#!/bin/bash

# Exit on error
set -e

echo "🔐 Setting up SSL certificates..."

# Get domain name
read -p "Enter your domain name (e.g., techwithpraveen.com): " DOMAIN

# Obtain SSL certificate
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

# Setup auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

echo "✅ SSL certificates installed and auto-renewal configured!"