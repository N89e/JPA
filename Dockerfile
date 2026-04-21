FROM node:18-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Répertoire de travail
WORKDIR /app

# Copier package.json root
COPY package.json .

# Copier backend
COPY backend ./backend
WORKDIR /app/backend
RUN npm install

# Revenin à la racine
WORKDIR /app

# Copier frontend
COPY frontend ./frontend

# Exposer les ports
EXPOSE 5000

# Démarrer le backend
CMD ["node", "backend/src/server.js"]
