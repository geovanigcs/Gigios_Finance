#!/bin/bash

# Script de setup inicial do projeto Docker

set -e

echo "🚀 Gigios Finance - Setup Docker"
echo "================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker não está instalado!${NC}"
    echo "Por favor, instale o Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose não está instalado!${NC}"
    echo "Por favor, instale o Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${GREEN}✅ Docker instalado${NC}"
echo -e "${GREEN}✅ Docker Compose instalado${NC}"
echo ""

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Criando arquivo .env...${NC}"
    cp .env.example .env
    
    # Gerar NEXTAUTH_SECRET aleatório
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    
    # Atualizar NEXTAUTH_SECRET no .env
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/your-super-secret-key-change-this-in-production/$NEXTAUTH_SECRET/" .env
    else
        sed -i "s/your-super-secret-key-change-this-in-production/$NEXTAUTH_SECRET/" .env
    fi
    
    echo -e "${GREEN}✅ Arquivo .env criado${NC}"
    echo -e "${YELLOW}⚠️  IMPORTANTE: Configure suas credenciais do Google OAuth no arquivo .env${NC}"
    echo ""
else
    echo -e "${GREEN}✅ Arquivo .env já existe${NC}"
fi

# Criar diretórios necessários
echo -e "${YELLOW}📁 Criando diretórios necessários...${NC}"
mkdir -p docker/nginx/ssl
mkdir -p docker/postgres/init
mkdir -p docker/pgadmin
chmod +x docker/postgres/init/*.sh 2>/dev/null || true
chmod +x docker/nginx/ssl/generate-ssl.sh 2>/dev/null || true
echo -e "${GREEN}✅ Diretórios criados${NC}"
echo ""

# Perguntar se quer gerar certificados SSL
read -p "🔐 Deseja gerar certificados SSL para HTTPS? (s/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo -e "${YELLOW}🔐 Gerando certificados SSL...${NC}"
    bash docker/nginx/ssl/generate-ssl.sh
    echo ""
fi

echo ""
echo -e "${GREEN}✅ Setup concluído!${NC}"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure suas variáveis de ambiente no arquivo .env"
echo "2. Configure Google OAuth (GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET)"
echo "3. Execute: docker-compose up -d"
echo ""
echo "🌐 URLs disponíveis após iniciar:"
echo "   - Aplicação: http://localhost:3000"
echo "   - pgAdmin: http://localhost:5050"
echo "   - Nginx: http://localhost"
echo ""
echo "📚 Comandos úteis:"
echo "   - Iniciar: docker-compose up -d"
echo "   - Parar: docker-compose down"
echo "   - Ver logs: docker-compose logs -f"
echo "   - Rebuild: docker-compose up -d --build"
echo ""
