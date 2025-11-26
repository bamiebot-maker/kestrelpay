# KestrelPay MVP Setup Script
Write-Host "🚀 Setting up KestrelPay MVP..." -ForegroundColor Green

# Check for Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is required. Please install it first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js found: $(node --version)" -ForegroundColor Green

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend dependencies installation failed" -ForegroundColor Red
    exit 1
}

# Install frontend dependencies  
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location ../frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend dependencies installation failed" -ForegroundColor Red
    exit 1
}

# Create environment files
Write-Host "🔧 Creating environment files..." -ForegroundColor Yellow
Set-Location ../backend

@"
RPC_URL=http://localhost:8545
PRIVATE_KEY=your_private_key_here
PORT=3001
MONGODB_URI=mongodb://localhost:27017/kestrelpay
"@ | Out-File -FilePath ".env" -Encoding UTF8

Set-Location ../frontend

@"
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=KestrelPay
VITE_APP_VERSION=2.0.0
"@ | Out-File -FilePath ".env" -Encoding UTF8

Set-Location ..

Write-Host "🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host "" 
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Start backend: cd backend && npm start" -ForegroundColor White
Write-Host "2. Start frontend: cd frontend && npm run dev" -ForegroundColor White
Write-Host "3. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host "" 
Write-Host "🌊 KestrelPay Wave-2 MVP is ready!" -ForegroundColor Magenta
