# 🔐 Sistema de Autenticação com Email/Senha

## ✅ Implementação Concluída

Adicionei um sistema completo de autenticação com email e senha ao Gigio's Finance, mantendo a opção de login com Google.

---

## 📋 O que foi implementado

### 1. **Schema do Prisma** ✓
- Adicionado campo `password` (opcional) no modelo `User`
- Campo `emailVerified` já existia e foi mantido
- Migration criada e aplicada: `20251203130934_add_password_field`

### 2. **Dependências** ✓
- Instalado `bcryptjs` para hash seguro de senhas
- Instalado `@types/bcryptjs` para TypeScript

### 3. **NextAuth Configuration** ✓
- Adicionado `CredentialsProvider` ao lado do `GoogleProvider`
- Implementada validação de credenciais com bcrypt
- Ajustada estratégia de sessão para JWT (necessário para credentials)
- Callbacks atualizados para suportar ambos os métodos de autenticação

### 4. **API de Registro** ✓
- Criado endpoint: `POST /api/auth/register`
- Validações implementadas:
  - Email único (verifica duplicidade)
  - Senha com hash bcrypt (10 rounds)
  - Email e senha obrigatórios
  - Nome opcional
- Retorna erro 400 para emails duplicados

### 5. **Página de Registro** ✓
- Nova página: `/register`
- Formulário com validação usando `react-hook-form` + `zod`:
  - Nome (opcional, mínimo 2 caracteres)
  - Email (validação de formato)
  - Senha (mínimo 6 caracteres)
  - Confirmação de senha
- Login automático após registro bem-sucedido
- Link para voltar à página de login
- Toast notifications para feedback

### 6. **Página de Login Atualizada** ✓
- Mantido botão "Entrar com Google"
- Adicionado formulário de login com email/senha
- Validação usando `react-hook-form` + `zod`
- Separador visual entre as opções
- Link para criar conta nova
- Toast notifications para erros/sucesso

### 7. **Arquivo .env** ✓
- Criado `.env` com configurações locais
- Configurado para usar PostgreSQL local (porta 5432)
- Observação: Configure `NEXTAUTH_SECRET` em produção

---

## 🧪 Como Testar

### Pré-requisitos
1. Banco PostgreSQL rodando (já configurado via Docker)
2. Variável `DATABASE_URL` no `.env`

### 1. Criar uma nova conta

```bash
# Inicie o servidor de desenvolvimento
npm run dev
```

1. Acesse: http://localhost:3000
2. Clique em "Criar conta"
3. Preencha o formulário:
   - Nome: `Seu Nome` (opcional)
   - Email: `teste@exemplo.com`
   - Senha: `senha123`
   - Confirmação: `senha123`
4. Clique em "Criar conta"
5. Você será redirecionado automaticamente para `/onboarding` ou `/dashboard`

### 2. Fazer login com email/senha

1. Acesse: http://localhost:3000
2. Preencha os campos:
   - Email: `teste@exemplo.com`
   - Senha: `senha123`
3. Clique em "Entrar"
4. Você será redirecionado para o dashboard

### 3. Login com Google (continua funcionando)

1. Acesse: http://localhost:3000
2. Clique em "Entrar com Google"
3. Complete o fluxo OAuth

---

## 🔒 Segurança Implementada

- ✅ Senhas são hashadas com bcrypt (10 rounds)
- ✅ Senhas nunca são armazenadas em texto plano
- ✅ Validação de email duplicado antes de criar conta
- ✅ Mensagens de erro genéricas para login (não revela se email existe)
- ✅ Sessões JWT para autenticação stateless
- ✅ HTTPS recomendado em produção

---

## 📁 Arquivos Criados/Modificados

### Criados:
- `app/api/auth/register/route.ts` - Endpoint de registro
- `app/register/page.tsx` - Página de registro
- `.env` - Variáveis de ambiente locais
- `prisma/migrations/20251203130934_add_password_field/` - Migration

### Modificados:
- `prisma/schema.prisma` - Adicionado campo `password`
- `lib/auth.ts` - Adicionado CredentialsProvider
- `app/page.tsx` - Adicionado formulário de login
- `package.json` - Adicionado bcryptjs

---

## 🚀 Deploy em Produção

### Variáveis de Ambiente Necessárias

```env
DATABASE_URL="postgresql://user:pass@host/db"
NEXTAUTH_URL="https://seu-dominio.com"
NEXTAUTH_SECRET="gere-com-openssl-rand-base64-32"
GOOGLE_CLIENT_ID="seu-client-id"  # opcional
GOOGLE_CLIENT_SECRET="seu-secret"  # opcional
```

### Gerar NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

### Aplicar Migrations em Produção

```bash
# Localmente, apontando para o banco de produção
DATABASE_URL="sua-url-producao" npx prisma migrate deploy
```

---

## 🔄 Fluxo de Autenticação

### Registro:
1. Usuário preenche formulário → 
2. POST `/api/auth/register` → 
3. Valida email único → 
4. Hash da senha com bcrypt → 
5. Cria usuário no banco → 
6. Login automático com credentials → 
7. Redireciona para onboarding

### Login com Email/Senha:
1. Usuário preenche formulário → 
2. NextAuth chama `authorize()` do CredentialsProvider → 
3. Busca usuário por email → 
4. Compara senha com bcrypt → 
5. Retorna usuário ou erro → 
6. Cria sessão JWT → 
7. Redireciona para dashboard

### Login com Google (inalterado):
1. OAuth flow do Google → 
2. NextAuth recebe token → 
3. Cria/atualiza usuário no banco → 
4. Cria sessão → 
5. Redireciona

---

## ⚠️ Observações Importantes

1. **Estratégia de Sessão**: Mudou de `database` para `jwt`
   - Necessário para CredentialsProvider funcionar
   - Sessões não são mais armazenadas no banco
   - Tokens JWT contém informações do usuário

2. **Google OAuth ainda funciona**: Ambos os métodos convivem
   - Usuários podem ter conta Google OU email/senha
   - Campo `password` é `null` para contas Google

3. **Email Verification**: 
   - Atualmente marca como verificado automaticamente
   - Para produção, considere adicionar fluxo de verificação por email

4. **Password Reset**: Não implementado ainda
   - Próximo passo sugerido: adicionar "Esqueci minha senha"

---

## 🎯 Próximos Passos Sugeridos

1. **Verificação de Email**
   - Enviar email de confirmação após registro
   - Impedir login até verificação

2. **Recuperação de Senha**
   - Endpoint `/api/auth/forgot-password`
   - Envio de email com token de reset
   - Página para definir nova senha

3. **Política de Senhas Forte**
   - Exigir caracteres especiais
   - Mínimo de 8 caracteres
   - Incluir maiúsculas, números, etc.

4. **Rate Limiting**
   - Limitar tentativas de login
   - Proteção contra brute force

5. **2FA (Two-Factor Authentication)**
   - Adicionar camada extra de segurança
   - TOTP ou SMS

---

## 🐛 Troubleshooting

### Erro: "Email e senha são obrigatórios"
- Verifique se está enviando ambos os campos no formulário

### Erro: "Este email já está cadastrado"
- Use outro email ou faça login com a conta existente

### Erro: "Credenciais inválidas"
- Email ou senha incorretos
- Verifique se o usuário foi criado corretamente

### Erro: "Cannot read properties of undefined"
- Execute `npx prisma generate` para regenerar o client
- Reinicie o servidor dev

### Login não funciona após registro
- Verifique se a migration foi aplicada
- Confirme que `NEXTAUTH_SECRET` está definido no `.env`

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do console
2. Confirme que o banco está rodando
3. Valide as variáveis de ambiente
4. Execute `npx prisma migrate status` para ver estado das migrations

**Status**: ✅ Sistema funcionando e pronto para uso!
