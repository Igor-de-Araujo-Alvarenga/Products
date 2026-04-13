@echo off
echo Installing dependencies...
cd FrontProducts
call npm install

echo Starting Backend...
cd ..\Products
start "Backend" dotnet run --urls "https://localhost:7086"

echo Starting Frontend...
cd ..\FrontProducts
start "Frontend" npm run dev

echo Both servers are starting...
echo Backend: https://localhost:7086
echo Frontend: http://localhost:5173 (or as shown in terminal)