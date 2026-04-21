@echo off
REM Script de démarrage rapide pour Windows - Portfolio
REM Utilisation: start.bat

echo.
echo ==========================================
echo 🚀 Portfolio - Démarrage Rapide (Windows)
echo ==========================================
echo.

REM Vérifier si Node.js est installé
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js n'est pas installé
    echo 📥 Installer depuis: https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js trouvé
echo.

REM Créer .env s'il n'existe pas
if not exist ".env" (
    echo 📝 Création du fichier .env...
    copy .env.example .env
    echo ⚠️  Éditez .env pour configurer votre email
    echo.
)

REM Installer les dépendances
echo 📦 Installation des dépendances...
cd backend
call npm install
cd ..
cd frontend
call npm install
cd ..

echo.
echo ==========================================
echo Instructions de démarrage:
echo ==========================================
echo.
echo 📋 Option 1: Mode développement (2 terminals)
echo Terminal 1: cd backend ^&^& npm run dev
echo Terminal 2: cd frontend ^&^& npm start
echo.
echo 📋 Option 2: Mode développement (1 terminal)
echo npm run dev
echo.
echo 📋 Option 3: Avec Docker
echo docker-compose up
echo.
echo 🌐 Accès:
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
pause
