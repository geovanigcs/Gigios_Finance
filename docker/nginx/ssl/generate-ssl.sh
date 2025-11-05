#!/bin/bash

# Script para gerar certificados SSL auto-assinados para desenvolvimento
# NÃO USE EM PRODUÇÃO! Use Let's Encrypt ou certificados válidos

set -e

DOMAIN="localhost"
DAYS=365
COUNTRY="BR"
STATE="Sao Paulo"
CITY="Sao Paulo"
ORG="Gigios Finance"
OU="Development"

SSL_DIR="./docker/nginx/ssl"

echo "🔐 Gerando certificados SSL para desenvolvimento..."

# Criar diretório se não existir
mkdir -p "$SSL_DIR"

# Gerar chave privada
openssl genrsa -out "$SSL_DIR/nginx-selfsigned.key" 2048

# Gerar certificado
openssl req -new -x509 \
    -key "$SSL_DIR/nginx-selfsigned.key" \
    -out "$SSL_DIR/nginx-selfsigned.crt" \
    -days $DAYS \
    -subj "/C=$COUNTRY/ST=$STATE/L=$CITY/O=$ORG/OU=$OU/CN=$DOMAIN"

# Gerar parâmetros Diffie-Hellman
openssl dhparam -out "$SSL_DIR/dhparam.pem" 2048

echo "✅ Certificados SSL gerados com sucesso!"
echo "📁 Localização: $SSL_DIR"
echo ""
echo "⚠️  ATENÇÃO: Estes certificados são auto-assinados e destinados APENAS para desenvolvimento!"
echo "⚠️  Para produção, use certificados válidos (Let's Encrypt, etc.)"
