#!/bin/bash
set -e

# Script de inicialização do PostgreSQL
echo "Initializing Gigios Finance Database..."

# Criar extensões úteis
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Criar extensões
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pg_trgm";
    
    -- Criar schema se necessário
    CREATE SCHEMA IF NOT EXISTS public;
    
    -- Grant permissions
    GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USER;
    GRANT ALL ON SCHEMA public TO $POSTGRES_USER;
    
    -- Configurações de performance
    ALTER DATABASE $POSTGRES_DB SET timezone TO 'America/Sao_Paulo';
EOSQL

echo "Database initialization completed!"
