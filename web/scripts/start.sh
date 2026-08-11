#!/bin/bash

echo "🚀 Starting Lipa Mdogo Web Platform..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
  echo ""
fi

# Check .env.local files
if [ ! -f "apps/admin/.env.local" ]; then
  echo "⚙️  Creating apps/admin/.env.local..."
  cp apps/admin/.env.local.example apps/admin/.env.local
fi

if [ ! -f "apps/agent/.env.local" ]; then
  echo "⚙️  Creating apps/agent/.env.local..."
  cp apps/agent/.env.local.example apps/agent/.env.local
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📱 To start development servers:"
echo "   npm run dev"
echo ""
echo "🔗 Admin dashboard:  http://localhost:3000"
echo "🔗 Agent app:        http://localhost:3001"
echo ""
echo "⚠️  Make sure backend is running: php artisan serve"
