#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment..."

# Configuration
REMOTE_USER="your-username"
REMOTE_HOST="your-server-ip"
REMOTE_PATH="/var/www/techwithpraveen"

# Build React app
echo "📦 Building React application..."
cd client
npm ci
npm run build
cd ..

# Copy files to server
echo "📤 Copying files to server (port 22)..."
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '.env' \
  -e "ssh -p 22" \
  ./ $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/

# Install dependencies and restart on server
echo "🔧 Configuring server..."
ssh -p 22 $REMOTE_USER@$REMOTE_HOST << 'EOF'
    cd /var/www/techwithpraveen
    
    # Install server dependencies
    cd server
    npm ci --production
    
    # Copy environment file if it exists
    if [ -f ../.env.production ]; then
        cp ../.env.production .env
    fi
    
    # Restart application with PM2
    pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js
    pm2 save
    sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER
    
    # Test Nginx configuration
    sudo nginx -t
    sudo systemctl reload nginx
    
    echo "✅ Deployment complete!"
EOF

echo "🎉 Deployment successful!"
echo "🌎 Website: https://$REMOTE_HOST"