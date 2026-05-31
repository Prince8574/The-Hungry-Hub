@echo off
echo Starting The Hungry Hub - All Services
echo =====================================

echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd server && npm run dev"

echo.
echo Waiting 3 seconds before starting frontend services...
timeout /t 3 /nobreak >nul

echo.
echo Starting Customer App...
start "Customer App" cmd /k "cd client && npm run dev"

echo.
echo Starting Admin Panel...
start "Admin Panel" cmd /k "cd admin && npm run dev"

echo.
echo =====================================
echo All services are starting!
echo.
echo URLs:
echo - Customer App: http://localhost:5173
echo - Admin Panel:  http://localhost:5174
echo - Backend API:  http://localhost:5000
echo.
echo Admin Login:
echo - Email: admin@hungry.com
echo - Password: admin123
echo =====================================

pause