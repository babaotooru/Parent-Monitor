# Start ParentCare Backend with Supabase
# Run this script after configuring application-supabase.properties

Write-Host "🚀 Starting ParentCare Backend with Supabase..." -ForegroundColor Green
Write-Host ""

# Check if application-supabase.properties is configured
$configFile = "backend\src\main\resources\application-supabase.properties"
$content = Get-Content $configFile -Raw

if ($content -match "YOUR_DATABASE_PASSWORD_HERE") {
    Write-Host "❌ ERROR: Supabase not configured!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please update these values in $configFile :" -ForegroundColor Yellow
    Write-Host "  1. spring.datasource.url = your Supabase URL" -ForegroundColor Yellow
    Write-Host "  2. spring.datasource.password = your database password" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Get credentials from: https://app.supabase.com → Settings → Database" -ForegroundColor Cyan
    exit 1
}

Write-Host "✅ Configuration looks good!" -ForegroundColor Green
Write-Host "📡 Starting backend with Supabase profile..." -ForegroundColor Cyan
Write-Host ""

cd backend
mvn spring-boot:run "-Dspring-boot.run.profiles=supabase"
