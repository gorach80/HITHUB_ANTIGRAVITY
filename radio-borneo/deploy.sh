#!/usr/bin/env bash
#
# Script de despliegue para GitHub Pages
# Uso: ./deploy.sh
#
set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Despliegue de Radio de Borneo a GitHub Pages${NC}"
echo "──────────────────────────────────────────────"

# Verificar que estamos en un repo git
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  echo -e "${RED}❌ No estás en un repositorio git${NC}"
  exit 1
fi

# Verificar rama actual
BRANCH=$(git branch --show-current)
echo -e "${YELLOW}📍 Rama actual: ${BRANCH}${NC}"

if [ "$BRANCH" != "main" ]; then
  echo -e "${YELLOW}⚠ No estás en la rama main. ¿Continuar? (y/n)${NC}"
  read -r response
  if [ "$response" != "y" ] && [ "$response" != "Y" ]; then
    echo "Despliegue cancelado."
    exit 0
  fi
fi

# Verificar que no haya cambios sin commitear
if ! git diff-index --quiet HEAD --; then
  echo -e "${RED}❌ Hay cambios sin commitear. Haz commit primero.${NC}"
  git status --short
  exit 1
fi

echo -e "${BLUE}📦 Verificando dependencias...${NC}"
if [ ! -d node_modules ]; then
  echo -e "${YELLOW}⚠ node_modules no existe. Ejecutando npm install...${NC}"
  npm install
fi

echo -e "${BLUE}🧪 Smoke test local...${NC}"
# Iniciar servidor en background, verificar, detener
node start-server.js &
SERVER_PID=$!
sleep 3

STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8080/ || echo "000")
if [ "$STATUS" != "200" ]; then
  echo -e "${RED}❌ Smoke test falló (HTTP $STATUS)${NC}"
  kill $SERVER_PID 2>/dev/null
  exit 1
fi
echo -e "${GREEN}✓ Servidor responde 200${NC}"
kill $SERVER_PID 2>/dev/null

echo -e "${BLUE}📤 Haciendo push a origin...${NC}"
git push origin "$BRANCH"

echo -e "${GREEN}✅ Despliegue iniciado!${NC}"
echo ""
echo -e "${BLUE}📋 Próximos pasos:${NC}"
echo "   1. Ve a: https://github.com/$(git remote get-url origin | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/actions"
echo "   2. Espera a que el workflow 'Deploy to GitHub Pages' termine."
echo "   3. Tu sitio estará en: https://TU_USUARIO.github.io/radio-borneo/"
echo ""
echo -e "${YELLOW}⏱ El deploy puede tardar 1-3 minutos.${NC}"
