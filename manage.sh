#!/bin/bash

# Script de gerenciamento do Gigio's Finance
# Uso: ./manage.sh [start|stop|restart|status|logs]

BACKEND_DIR="/home/geovani/Documentos/Gigio/gigios-finance-backend"
FRONTEND_DIR="/home/geovani/Documentos/Gigio/Gigios_Finance"
BACKEND_LOG="$BACKEND_DIR/backend.log"

case "$1" in
  start)
    echo "🚀 Iniciando Gigio's Finance..."
    
    # Iniciar Backend
    echo "📡 Iniciando backend..."
    cd "$BACKEND_DIR"
    nohup node dist/src/main.js > "$BACKEND_LOG" 2>&1 &
    echo "Backend iniciado (PID: $!)"
    
    # Aguardar backend iniciar
    sleep 2
    
    # Iniciar Frontend
    echo "🌐 Iniciando frontend..."
    cd "$FRONTEND_DIR"
    nohup npm run dev > /dev/null 2>&1 &
    echo "Frontend iniciado (PID: $!)"
    
    sleep 3
    echo ""
    echo "✅ Sistema iniciado com sucesso!"
    echo "   Backend:  http://localhost:4000/api"
    echo "   Frontend: http://localhost:3001"
    echo ""
    ;;
    
  stop)
    echo "🛑 Parando Gigio's Finance..."
    pkill -f "node dist/src/main.js"
    pkill -f "next dev"
    echo "✅ Sistema parado"
    ;;
    
  restart)
    echo "🔄 Reiniciando Gigio's Finance..."
    $0 stop
    sleep 2
    $0 start
    ;;
    
  status)
    echo "📊 Status do Sistema:"
    echo ""
    
    # Backend
    if ps aux | grep "node dist/src/main.js" | grep -v grep > /dev/null; then
      BACKEND_PID=$(ps aux | grep "node dist/src/main.js" | grep -v grep | awk '{print $2}')
      echo "✅ Backend rodando (PID: $BACKEND_PID)"
      curl -s http://localhost:4000/api > /dev/null && echo "   Respondendo em http://localhost:4000/api" || echo "   ⚠️ Não está respondendo"
    else
      echo "❌ Backend não está rodando"
    fi
    
    echo ""
    
    # Frontend
    if ps aux | grep "next dev" | grep -v grep > /dev/null; then
      FRONTEND_PID=$(ps aux | grep "next dev" | grep -v grep | awk '{print $2}')
      echo "✅ Frontend rodando (PID: $FRONTEND_PID)"
      
      # Detectar porta
      for port in 3000 3001 3002 3003; do
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:$port | grep -q "200"; then
          echo "   Disponível em http://localhost:$port"
          break
        fi
      done
    else
      echo "❌ Frontend não está rodando"
    fi
    
    echo ""
    ;;
    
  logs)
    echo "📋 Logs do Backend (Ctrl+C para sair):"
    tail -f "$BACKEND_LOG"
    ;;
    
  test)
    echo "🧪 Testando sistema..."
    echo ""
    
    # Testar backend
    echo "Backend:"
    curl -s http://localhost:4000/api && echo " ✅" || echo " ❌"
    
    echo ""
    echo "Registro de usuário:"
    curl -X POST http://localhost:4000/api/auth/register \
      -H "Content-Type: application/json" \
      -d '{
        "username": "teste_'$(date +%s)'",
        "firstName": "Teste",
        "lastName": "Sistema",
        "email": "teste'$(date +%s)'@example.com",
        "password": "senha123"
      }' 2>/dev/null | jq '.message' || echo "OK ou usuário já existe"
    
    echo ""
    ;;
    
  *)
    echo "Gigio's Finance - Sistema de Gestão Financeira"
    echo ""
    echo "Uso: $0 {start|stop|restart|status|logs|test}"
    echo ""
    echo "Comandos:"
    echo "  start   - Inicia o sistema completo (backend + frontend)"
    echo "  stop    - Para o sistema completo"
    echo "  restart - Reinicia o sistema"
    echo "  status  - Mostra o status dos serviços"
    echo "  logs    - Mostra os logs do backend em tempo real"
    echo "  test    - Testa se o sistema está funcionando"
    echo ""
    exit 1
    ;;
esac
