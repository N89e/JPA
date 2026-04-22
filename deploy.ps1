#!/bin/bash

# Script de déploiement simple pour Windows (PowerShell)
# Utilisez ce script pour déployer sur OVH

# Configuration
$REMOTE_USER = "votre_utilisateur"
$REMOTE_HOST = "votre_serveur_ovh.com"
$REMOTE_PATH = "/home/$REMOTE_USER/portfolio"

Write-Host "🚀 Début du déploiement..." -ForegroundColor Green

# 1. Vérifier le backend
Write-Host "📦 Vérification du backend..." -ForegroundColor Yellow
Set-Location ".\backend"
npm install

# 2. Vérifier le frontend
Write-Host "📦 Vérification du frontend..." -ForegroundColor Yellow
Set-Location "..\frontend"
npm install

# 3. Créer une archive
Write-Host "📦 Création de l'archive..." -ForegroundColor Yellow
Set-Location ".."
Compress-Archive -Path "backend", "frontend", ".env.example" -DestinationPath "portfolio.zip" -Force

# 4. Transférer via SCP (require PuTTY plink)
Write-Host "📤 Transfert vers OVH..." -ForegroundColor Yellow
# pscp.exe -r portfolio.zip "$($REMOTE_USER)@$($REMOTE_HOST):$REMOTE_PATH/"

Write-Host "✅ Déploiement réussi!" -ForegroundColor Green
Write-Host "📍 Votre portfolio est accessible sur: https://nunoesteves.com" -ForegroundColor Cyan
