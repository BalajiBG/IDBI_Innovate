#!/bin/bash
# WealthSeva AI — EC2 Deployment Script
# Run this on your EC2 instance after cloning the repo

echo "🚀 Deploying WealthSeva AI..."

# Install Node.js 20 (if not installed)
if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

# Install pm2 for process management
sudo npm install -g pm2

# Install dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install

echo "📦 Installing frontend dependencies..."
cd ../client
npm install

# Build React frontend
echo "🏗️ Building frontend..."
npm run build

# Go to server and start with pm2
cd ../server

# Create .env if not exists
if [ ! -f .env ]; then
  cp .env.example .env
  echo "⚠️  Please edit server/.env with your AWS credentials!"
fi

# Start with pm2 (auto-restart on crash)
pm2 stop wealthseva 2>/dev/null
pm2 start index.js --name wealthseva
pm2 save

echo ""
echo "✅ WealthSeva AI is live!"
echo "🌐 Open http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):3001"
echo ""
echo "📌 Useful commands:"
echo "   pm2 logs wealthseva    — view logs"
echo "   pm2 restart wealthseva — restart server"
echo "   pm2 stop wealthseva    — stop server"
