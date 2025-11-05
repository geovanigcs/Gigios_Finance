# 📁 Pasta Docker - Configurações

Esta pasta contém todas as configurações Docker do projeto Gigios Finance.

---

## 📂 Estrutura

```
docker/
├── nginx/              # Configurações Nginx
│   ├── conf.d/        # Server blocks
│   │   ├── default.conf        (desenvolvimento)
│   │   └── prod/
│   │       └── default.conf    (produção)
│   ├── ssl/           # Certificados SSL
│   │   └── generate-ssl.sh
│   ├── nginx.conf     # Config desenvolvimento
│   └── nginx.prod.conf # Config produção
│
├── postgres/          # Configurações PostgreSQL
│   └── init/         # Scripts de inicialização
│       └── 01-init.sh
│
└── pgadmin/          # Configurações pgAdmin
    └── servers.json  # Servidores pré-configurados
```

---

## 🌐 Nginx

### Arquivos de Configuração

#### `nginx.conf` (Desenvolvimento)
- Worker processes: auto
- Gzip: habilitado
- Rate limiting: 10 req/s
- Keep-alive: 65s

#### `nginx.prod.conf` (Produção)
- Worker connections: 2048
- SSL otimizado
- Rate limiting: 20 req/s
- Security headers completos

#### `conf.d/default.conf`
Configuração de rotas:
- `/` → Next.js (port 3000)
- `/health` → Health check
- `/_next/static` → Cache 365 dias
- WebSocket suportado (HMR)

### SSL

Gerar certificados auto-assinados:

```bash
cd docker/nginx/ssl
chmod +x generate-ssl.sh
./generate-ssl.sh
```

Ou com Make:
```bash
make ssl-generate
```

**⚠️ PRODUÇÃO**: Use Let's Encrypt

```bash
# Instalar Certbot
sudo apt-get install certbot

# Gerar certificado
sudo certbot certonly --standalone -d seu-dominio.com

# Copiar para pasta SSL
sudo cp /etc/letsencrypt/live/seu-dominio.com/fullchain.pem docker/nginx/ssl/
sudo cp /etc/letsencrypt/live/seu-dominio.com/privkey.pem docker/nginx/ssl/
```

### Testar Configuração

```bash
# Testar sintaxe
docker-compose exec nginx nginx -t

# Reload sem downtime
docker-compose exec nginx nginx -s reload
```

---

## 🗄️ PostgreSQL

### Script de Inicialização

`init/01-init.sh` executa automaticamente quando o container é criado pela primeira vez:

1. Cria extensões úteis:
   - `uuid-ossp` - Geração de UUIDs
   - `pg_trgm` - Busca de texto

2. Configura permissões
3. Define timezone para `America/Sao_Paulo`

### Adicionar Novos Scripts

Crie arquivos numerados:
```bash
docker/postgres/init/02-custom.sh
docker/postgres/init/03-indexes.sql
```

**Ordem de execução**: alfabética/numérica

### Executar Script Manualmente

```bash
docker-compose exec postgres psql -U gigios -d gigios_finance -f /docker-entrypoint-initdb.d/script.sql
```

---

## 🔧 pgAdmin

### Servidores Pré-configurados

O arquivo `servers.json` adiciona automaticamente o PostgreSQL:

- **Nome**: Gigios Finance PostgreSQL
- **Host**: postgres
- **Port**: 5432
- **Username**: gigios
- **Database**: gigios_finance

### Primeiro Acesso

1. Acesse: http://localhost:5050
2. Login:
   - Email: `admin@gigios.com`
   - Senha: `admin_password_2025`
3. Servidor já configurado!
4. Senha do DB será pedida: `gigios_secure_password_2025`

### Adicionar Novo Servidor Manualmente

1. Clique em "Add New Server"
2. General tab:
   - Name: Seu nome
3. Connection tab:
   - Host: `postgres`
   - Port: `5432`
   - Username: `gigios`
   - Password: senha do `.env`

---

## 📝 Customizações

### Nginx - Adicionar Rota

Edite `docker/nginx/conf.d/default.conf`:

```nginx
# Nova rota personalizada
location /api/v2 {
    proxy_pass http://nextjs_app/api/v2;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
}
```

### Nginx - Aumentar Tamanho Upload

Edite `nginx.conf`:

```nginx
client_max_body_size 50M;  # De 20M para 50M
```

### PostgreSQL - Ajustar Performance

Crie `docker/postgres/init/99-performance.sql`:

```sql
-- Aumentar memória compartilhada
ALTER SYSTEM SET shared_buffers = '256MB';

-- Aumentar cache
ALTER SYSTEM SET effective_cache_size = '1GB';

-- Reload configuração
SELECT pg_reload_conf();
```

### PostgreSQL - Criar Database Adicional

Edite `docker/postgres/init/01-init.sh`:

```bash
# Criar database de teste
createdb -U $POSTGRES_USER gigios_finance_test
```

---

## 🔍 Debugging

### Ver Logs Nginx

```bash
# Logs de acesso
docker-compose exec nginx tail -f /var/log/nginx/access.log

# Logs de erro
docker-compose exec nginx tail -f /var/log/nginx/error.log

# Filtrar por erro 500
docker-compose exec nginx grep "500" /var/log/nginx/access.log
```

### Testar Conectividade

```bash
# App → PostgreSQL
docker-compose exec app nc -zv postgres 5432

# App → Nginx
docker-compose exec app wget -O- http://nginx/health
```

### Ver Processos Nginx

```bash
docker-compose exec nginx ps aux
```

### Ver Conexões PostgreSQL

```bash
docker-compose exec postgres psql -U gigios -d gigios_finance -c "SELECT * FROM pg_stat_activity;"
```

---

## 🚨 Troubleshooting

### Nginx não inicia

```bash
# Ver erro
docker-compose logs nginx

# Testar config
docker-compose exec nginx nginx -t

# Verificar permissões SSL
ls -la docker/nginx/ssl/
```

### PostgreSQL não aceita conexões

```bash
# Ver logs
docker-compose logs postgres

# Verificar se está rodando
docker-compose exec postgres pg_isready -U gigios

# Verificar porta
docker-compose exec postgres netstat -tlnp | grep 5432
```

### pgAdmin não conecta no PostgreSQL

1. Verifique se ambos estão na mesma network:
   ```bash
   docker network inspect gigios_network
   ```

2. Use hostname `postgres`, não `localhost`

3. Verifique senha no `.env`

---

## 🔐 Segurança

### Permissões de Arquivos

```bash
# Scripts devem ser executáveis
chmod +x docker/postgres/init/*.sh
chmod +x docker/nginx/ssl/generate-ssl.sh

# SSL keys devem ser privadas
chmod 600 docker/nginx/ssl/*.key
chmod 644 docker/nginx/ssl/*.crt
```

### Secrets em Produção

**Não use** senhas hardcoded. Use:

1. **Docker Secrets**:
   ```yaml
   secrets:
     db_password:
       file: ./secrets/db_password.txt
   ```

2. **Environment Variables** (runtime):
   ```bash
   POSTGRES_PASSWORD=$(cat /run/secrets/db_password)
   ```

3. **Vault** (HashiCorp, AWS Secrets Manager, etc.)

---

## 📊 Monitoramento

### Nginx Metrics

Adicionar ao `docker-compose.yml`:

```yaml
nginx-exporter:
  image: nginx/nginx-prometheus-exporter:latest
  command:
    - -nginx.scrape-uri=http://nginx:8080/stub_status
  ports:
    - "9113:9113"
```

Habilitar em `nginx.conf`:

```nginx
server {
    listen 8080;
    location /stub_status {
        stub_status on;
        access_log off;
        allow 127.0.0.1;
        deny all;
    }
}
```

### PostgreSQL Metrics

Adicionar ao `docker-compose.yml`:

```yaml
postgres-exporter:
  image: prometheuscommunity/postgres-exporter
  environment:
    DATA_SOURCE_NAME: "postgresql://gigios:password@postgres:5432/gigios_finance"
  ports:
    - "9187:9187"
```

---

## 🎯 Boas Práticas

### ✅ Faça

- Use versões específicas de imagens
- Teste configs localmente antes de produção
- Mantenha backups dos certificados SSL
- Documente mudanças customizadas
- Use health checks

### ❌ Não Faça

- Não use certificados auto-assinados em produção
- Não exponha pgAdmin publicamente sem autenticação
- Não use senhas padrão
- Não ignore logs de erro
- Não desabilite SSL em produção

---

## 📚 Referências

- [Nginx Docs](https://nginx.org/en/docs/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [pgAdmin Docs](https://www.pgadmin.org/docs/)
- [Docker Compose Docs](https://docs.docker.com/compose/)

---

**Configurações mantidas e gerenciadas nesta pasta!** 🐳
