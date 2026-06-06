@echo off
REM NetViz3D Quick Start Script

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    NetViz3D Quick Start                      ║
echo ║              Network Simulation & Learning Platform          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

cd /d "e:\OneDrive\Desktop\D NetWiz 3D Web\netviz3d"

echo ✓ Checking dependencies...
if not exist "node_modules" (
    echo ! Dependencies not found. Installing...
    call npm install
)

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  Starting NetViz3D Development Server                        ║
echo ║                                                              ║
echo ║  Frontend: http://localhost:5173                             ║
echo ║  Backend:  http://localhost:3001                             ║
echo ║                                                              ║
echo ║  Press Ctrl+C to stop the servers                            ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Start dev server with concurrently
call npm run dev:all

pause
