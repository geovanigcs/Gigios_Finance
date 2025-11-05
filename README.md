# 💰 Gigio's Finance 📊

Bem-vindo ao **Gigio's Finance**, uma aplicação dedicada a simular a gestão de entradas e saídas financeiras do usuário! Este projeto foi desenvolvido para ajudar os usuários a terem um maior controle sobre suas finanças, permitindo que gerenciem suas despesas e receitas de forma intuitiva e eficaz.

## 🎯 Objetivo do Projeto

O objetivo deste projeto é criar uma plataforma que facilite a gestão financeira pessoal. Com um design focado na experiência do usuário, buscamos oferecer uma interface amigável onde os usuários possam visualizar suas transações financeiras, assinar um plano premium e obter insights sobre seus hábitos de consumo.

## 💡 Abordagem de Design

Neste projeto, utilizei princípios de design centrado no usuário, focando em:

- **Navegação Simples**: Estrutura clara e fácil de navegar para uma experiência de uso agradável.
- **Animações Atraentes**: Implementação de animações sutis com Framer Motion e GSAP para melhorar a interação do usuário e tornar a navegação mais dinâmica.
- **Estética Visual**: Design moderno e responsivo com Tailwind CSS, proporcionando uma experiência visual agradável.

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 14**: Framework React com Server Components
- **TypeScript**: Desenvolvimento type-safe
- **Tailwind CSS**: Estilização utilitária
- **Shadcn/ui**: Componentes de UI acessíveis
- **Framer Motion**: Animações fluidas
- **GSAP**: Animações de alta performance
- **Radix UI**: Primitivos de UI headless

### Backend
- **Next.js API Routes**: Endpoints serverless
- **NextAuth.js**: Autenticação (Google OAuth)
- **Prisma**: ORM moderno para TypeScript

### Database & Infraestrutura
- **PostgreSQL 16**: Banco de dados relacional
- **Docker**: Containerização
- **Nginx**: Reverse proxy e load balancer
- **pgAdmin**: Interface de gerenciamento de banco

### DevOps
- **Docker Compose**: Orquestração de containers
- **Multi-stage builds**: Otimização de imagens
- **Volume persistence**: Persistência de dados

## 📦 Funcionalidades

- **Login com Google**: Permite que os usuários façam login de forma rápida e segura com suas contas do Google.
- **Dashboard Interativo**: Visualização do histórico de transações financeiras e gerenciamento de entradas e saídas.
- **Área de Assinatura**: Opção para os usuários assinarem o plano premium, oferecendo recursos adicionais.
- **Animações Dinâmicas**: Animações que tornam a interação mais agradável e intuitiva.

## 📸 Imagens do Projeto



## 🐳 Docker - Execução Simplificada

### Início Rápido (Recomendado)

```bash
# 1. Clone o repositório
git clone https://github.com/geovanigcs/Gigios_Finance.git
cd Gigios_Finance

# 2. Execute o setup
chmod +x docker-setup.sh
./docker-setup.sh

# 3. Configure Google OAuth no arquivo .env
# GOOGLE_CLIENT_ID=seu-client-id
# GOOGLE_CLIENT_SECRET=seu-client-secret

# 4. Inicie a aplicação
docker-compose up -d
```

**Pronto! 🚀** Acesse:
- Aplicação: http://localhost:3000
- pgAdmin: http://localhost:5050

### Comandos Úteis

```bash
# Com Makefile (mais fácil)
make help          # Ver todos os comandos
make up            # Iniciar
make down          # Parar
make logs          # Ver logs
make shell         # Acessar container

# Ou com Docker Compose
docker-compose up -d              # Iniciar
docker-compose down               # Parar
docker-compose logs -f            # Ver logs
docker-compose exec app sh        # Shell do container
```

📚 **Documentação Completa**: Veja [DOCKER.md](./DOCKER.md) ou [QUICK-START.md](./QUICK-START.md)

---

## 💻 Execução Local (Sem Docker)

<details>
<summary>Clique para expandir instruções sem Docker</summary>

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### Passos

1. Clone o repositório:
```bash
git clone https://github.com/geovanigcs/Gigios_Finance.git 
cd Gigios_Finance
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite .env com suas configurações
```

4. Configure o banco de dados:
```bash
npx prisma migrate deploy
npx prisma generate
npm run db:seed
```

5. Inicie o servidor:
```bash
npm run dev
```

6. Acesse: http://localhost:3000

</details>
## 🤝 Contribuição

Contribuições são bem-vindas! Se você deseja contribuir, siga estas etapas:

1. Fork o repositório.
2. Crie uma nova branch (`git checkout -b feature/nova-funcionalidade`).
3. Faça suas alterações e commit (`git commit -m 'Adiciona nova funcionalidade'`).
4. Envie para o repositório remoto (`git push origin feature/nova-funcionalidade`).
5. Abra um Pull Request.

## 📞 Contato
Para dúvidas ou sugestões, você pode entrar em contato através de:

- Email: geovanigcs.dev@gmail.com
- LinkedIn: [Geovani Cordeiro](https://www.linkedin.com/in/geovanicordeirodev/)
- GitHub: [geovanigcs](https://github.com/geovanigcs)


---

Agradecemos por visitar o Gigio's Finance! Esperamos que você tenha uma ótima experiência gerenciando suas finanças! 🚀
