#!/bin/bash

# Script de deploy para produção

set -e

echo "🚀 Gigios Finance - Deploy para Produção"
echo "========================================"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Verificar se está no ambiente correto
if [ ! -f .env ]; then
    echo -e "${RED}❌ Arquivo .env não encontrado!${NC}"
    echo "Execute primeiro: ./docker-setup.sh"
    exit 1
fi

# Verificar variáveis críticas
echo -e "${YELLOW}🔍 Verificando variáveis de ambiente...${NC}"

required_vars=("POSTGRES_PASSWORD" "NEXTAUTH_SECRET" "GOOGLE_CLIENT_ID" "GOOGLE_CLIENT_SECRET")
missing_vars=()

for var in "${required_vars[@]}"; do
    if ! grep -q "^${var}=" .env || grep -q "^${var}=your-" .env || grep -q "^${var}=$" .env; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo -e "${RED}❌ As seguintes variáveis não estão configuradas:${NC}"
    printf '%s\n' "${missing_vars[@]}"
    echo ""
    echo "Configure-as no arquivo .env antes de continuar."
    exit 1
fi

echo -e "${GREEN}✅ Variáveis de ambiente OK${NC}"
echo ""

# Backup do banco de dados (se existir)
if docker ps -a | grep -q "gigios_postgres"; then
    echo -e "${YELLOW}💾 Criando backup do banco de dados...${NC}"
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
    docker exec gigios_postgres pg_dump -U gigios gigios_finance > "$BACKUP_FILE"
    echo -e "${GREEN}✅ Backup criado: $BACKUP_FILE${NC}"
    echo ""
fi

# Parar containers de desenvolvimento
echo -e "${YELLOW}🛑 Parando containers de desenvolvimento...${NC}"
docker-compose down
echo ""

# Build das imagens de produção
echo -e "${YELLOW}🔨 Construindo imagens de produção...${NC}"
docker-compose -f docker-compose.prod.yml build --no-cache
echo ""

# Iniciar containers de produção
echo -e "${YELLOW}🚀 Iniciando containers de produção...${NC}"
docker-compose -f docker-compose.prod.yml up -d
echo ""

# Aguardar PostgreSQL estar pronto
echo -e "${YELLOW}⏳ Aguardando PostgreSQL estar pronto...${NC}"
sleep 10
echo ""

# Executar migrations
echo -e "${YELLOW}🔄 Executando migrations do Prisma...${NC}"
docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
echo ""

# Verificar status
echo -e "${YELLOW}🔍 Verificando status dos containers...${NC}"
docker-compose -f docker-compose.prod.yml ps
echo ""

echo -e "${GREEN}✅ Deploy concluído!${NC}"
echo ""
echo "🌐 Aplicação disponível em:"
echo "   - HTTP: http://seu-dominio.com"
echo "   - HTTPS: https://seu-dominio.com (se SSL configurado)"
echo ""
echo "📊 Monitoramento:"
echo "   - Logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "   - Status: docker-compose -f docker-compose.prod.yml ps"
echo ""
