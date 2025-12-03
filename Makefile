.PHONY: help setup up down build rebuild logs shell db-shell prisma-studio clean deploy backup

# Variáveis
DOCKER_COMPOSE = docker-compose
DOCKER_COMPOSE_PROD = docker-compose -f docker-compose.prod.yml
APP_SERVICE = app
DB_SERVICE = postgres

# Cores para output
RED = \033[0;31m
GREEN = \033[0;32m
YELLOW = \033[1;33m
NC = \033[0m # No Color

help: ## Mostra esta mensagem de ajuda
	@echo "$(GREEN)Gigios Finance - Docker Commands$(NC)"
	@echo "=================================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "$(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'

setup: ## Setup inicial do projeto
	@echo "$(YELLOW)🚀 Executando setup inicial...$(NC)"
	@chmod +x docker-setup.sh docker-deploy.sh
	@chmod +x docker/postgres/init/*.sh 2>/dev/null || true
	@chmod +x docker/nginx/ssl/generate-ssl.sh 2>/dev/null || true
	@./docker-setup.sh
	@echo "$(GREEN)✅ Setup concluído!$(NC)"

up: ## Inicia containers de desenvolvimento
	@echo "$(YELLOW)🚀 Iniciando containers de desenvolvimento...$(NC)"
	@$(DOCKER_COMPOSE) up -d
	@echo "$(GREEN)✅ Containers iniciados!$(NC)"
	@echo "$(YELLOW)📍 Aplicação: http://localhost:3000$(NC)"
	@echo "$(YELLOW)📍 pgAdmin: http://localhost:5050$(NC)"

down: ## Para todos os containers
	@echo "$(YELLOW)🛑 Parando containers...$(NC)"
	@$(DOCKER_COMPOSE) down
	@echo "$(GREEN)✅ Containers parados!$(NC)"

build: ## Build das imagens
	@echo "$(YELLOW)🔨 Construindo imagens...$(NC)"
	@$(DOCKER_COMPOSE) build
	@echo "$(GREEN)✅ Build concluído!$(NC)"

rebuild: ## Rebuild e restart dos containers
	@echo "$(YELLOW)🔨 Reconstruindo e reiniciando...$(NC)"
	@$(DOCKER_COMPOSE) up -d --build
	@echo "$(GREEN)✅ Containers reconstruídos!$(NC)"

logs: ## Mostra logs de todos os containers
	@$(DOCKER_COMPOSE) logs -f

logs-app: ## Mostra logs da aplicação
	@$(DOCKER_COMPOSE) logs -f $(APP_SERVICE)

logs-db: ## Mostra logs do PostgreSQL
	@$(DOCKER_COMPOSE) logs -f $(DB_SERVICE)

shell: ## Acessa shell do container da aplicação
	@echo "$(YELLOW)🔧 Acessando shell do container...$(NC)"
	@$(DOCKER_COMPOSE) exec $(APP_SERVICE) sh

db-shell: ## Acessa psql do PostgreSQL
	@echo "$(YELLOW)🔧 Acessando PostgreSQL...$(NC)"
	@$(DOCKER_COMPOSE) exec $(DB_SERVICE) psql -U gigios -d gigios_finance

prisma-studio: ## Abre Prisma Studio
	@echo "$(YELLOW)🔍 Abrindo Prisma Studio...$(NC)"
	@$(DOCKER_COMPOSE) exec $(APP_SERVICE) npx prisma studio

prisma-migrate: ## Executa migrations do Prisma
	@echo "$(YELLOW)🔄 Executando migrations...$(NC)"
	@$(DOCKER_COMPOSE) exec $(APP_SERVICE) npx prisma migrate deploy
	@echo "$(GREEN)✅ Migrations executadas!$(NC)"

prisma-generate: ## Gera Prisma Client
	@echo "$(YELLOW)🔄 Gerando Prisma Client...$(NC)"
	@$(DOCKER_COMPOSE) exec $(APP_SERVICE) npx prisma generate
	@echo "$(GREEN)✅ Prisma Client gerado!$(NC)"

prisma-seed: ## Executa seed do banco
	@echo "$(YELLOW)🌱 Executando seed...$(NC)"
	@$(DOCKER_COMPOSE) exec $(APP_SERVICE) npm run db:seed
	@echo "$(GREEN)✅ Seed executado!$(NC)"

ps: ## Lista status dos containers
	@$(DOCKER_COMPOSE) ps

stats: ## Mostra estatísticas dos containers
	@docker stats

clean: ## Remove containers, volumes e imagens
	@echo "$(RED)⚠️  Isso vai remover TODOS os dados!$(NC)"
	@read -p "Tem certeza? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		echo "$(YELLOW)🗑️  Removendo tudo...$(NC)"; \
		$(DOCKER_COMPOSE) down -v; \
		docker volume prune -f; \
		echo "$(GREEN)✅ Limpeza concluída!$(NC)"; \
	fi

backup: ## Cria backup do banco de dados
	@echo "$(YELLOW)💾 Criando backup...$(NC)"
	@mkdir -p backups
	@docker exec gigios_postgres pg_dump -U gigios gigios_finance > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)✅ Backup criado em backups/$(NC)"

restore: ## Restaura backup do banco (uso: make restore FILE=backup.sql)
	@if [ -z "$(FILE)" ]; then \
		echo "$(RED)❌ Especifique o arquivo: make restore FILE=backup.sql$(NC)"; \
		exit 1; \
	fi
	@echo "$(YELLOW)♻️  Restaurando backup...$(NC)"
	@cat $(FILE) | docker exec -i gigios_postgres psql -U gigios -d gigios_finance
	@echo "$(GREEN)✅ Backup restaurado!$(NC)"

# Comandos de Produção
deploy: ## Deploy para produção
	@echo "$(YELLOW)🚀 Executando deploy...$(NC)"
	@./docker-deploy.sh

prod-up: ## Inicia containers de produção
	@echo "$(YELLOW)🚀 Iniciando produção...$(NC)"
	@$(DOCKER_COMPOSE_PROD) up -d
	@echo "$(GREEN)✅ Produção iniciada!$(NC)"

prod-down: ## Para containers de produção
	@echo "$(YELLOW)🛑 Parando produção...$(NC)"
	@$(DOCKER_COMPOSE_PROD) down
	@echo "$(GREEN)✅ Produção parada!$(NC)"

prod-build: ## Build de produção
	@echo "$(YELLOW)🔨 Build de produção...$(NC)"
	@$(DOCKER_COMPOSE_PROD) build --no-cache
	@echo "$(GREEN)✅ Build concluído!$(NC)"

prod-logs: ## Logs de produção
	@$(DOCKER_COMPOSE_PROD) logs -f

# SSL
ssl-generate: ## Gera certificados SSL auto-assinados
	@echo "$(YELLOW)🔐 Gerando certificados SSL...$(NC)"
	@bash docker/nginx/ssl/generate-ssl.sh
	@echo "$(GREEN)✅ Certificados gerados!$(NC)"

# Utilitários
install: ## Instala dependências no container
	@echo "$(YELLOW)📦 Instalando dependências...$(NC)"
	@$(DOCKER_COMPOSE) exec $(APP_SERVICE) npm install
	@echo "$(GREEN)✅ Dependências instaladas!$(NC)"

test: ## Executa testes
	@echo "$(YELLOW)🧪 Executando testes...$(NC)"
	@$(DOCKER_COMPOSE) exec $(APP_SERVICE) npm test

lint: ## Executa linter
	@echo "$(YELLOW)🔍 Executando linter...$(NC)"
	@$(DOCKER_COMPOSE) exec $(APP_SERVICE) npm run lint

format: ## Formata código
	@echo "$(YELLOW)✨ Formatando código...$(NC)"
	@$(DOCKER_COMPOSE) exec $(APP_SERVICE) npm run format

# Info
info: ## Mostra informações do ambiente
	@echo "$(GREEN)Gigios Finance - Informações$(NC)"
	@echo "=============================="
	@echo "$(YELLOW)Docker:$(NC)"
	@docker --version
	@echo "$(YELLOW)Docker Compose:$(NC)"
	@docker-compose --version
	@echo ""
	@echo "$(YELLOW)Containers:$(NC)"
	@$(DOCKER_COMPOSE) ps
	@echo ""
	@echo "$(YELLOW)Volumes:$(NC)"
	@docker volume ls | grep gigios || true
	@echo ""
	@echo "$(YELLOW)Networks:$(NC)"
	@docker network ls | grep gigios || true
