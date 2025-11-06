# 🚀 Guia de Deploy - Gigio's Finance

## Pré-requisitos

1. Banco de dados PostgreSQL em produção (não pode ser o Docker local)
2. Credenciais do Google OAuth configuradas
3. Conta na Vercel ou Netlify

---

## 🗄️ 1. Configurar Banco de Dados (Escolha uma opção)

### Opção A: Neon (Recomendado - Grátis)

1. Acesse: https://neon.tech
2. Crie uma conta e um novo projeto
3. Copie a **Connection String** (formato: `postgresql://...`)
4. Guarde para usar como `DATABASE_URL`

### Opção B: Supabase

1. Acesse: https://supabase.com
2. Crie um projeto
3. Vá em **Settings** → **Database**
4. Copie a **Connection String** em modo "Session"

### Opção C: Vercel Postgres (se usar Vercel)

1. No dashboard da Vercel, vá em **Storage**
2. Crie um novo **Postgres Database**
3. A variável `DATABASE_URL` será criada automaticamente

---

## 🔐 2. Configurar Google OAuth

1. Acesse: https://console.cloud.google.com
2. Crie um novo projeto ou use um existente
3. Vá em **APIs & Services** → **Credentials**
4. Clique em **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure:
   - Application type: **Web application**
   - Authorized JavaScript origins:
     - `http://localhost:3000` (desenvolvimento)
     - `https://seu-dominio.vercel.app` (produção)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://seu-dominio.vercel.app/api/auth/callback/google`
6. Copie **Client ID** e **Client Secret**

---

## 🌐 3. Deploy na Vercel

### A. Configurar Variáveis de Ambiente

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Adicione (para **Production**, **Preview** e **Development**):

```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
NEXTAUTH_URL=https://seu-projeto.vercel.app
NEXTAUTH_SECRET=sua-chave-secreta-gerada
GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret
```

**Para gerar `NEXTAUTH_SECRET`:**
```bash
openssl rand -base64 32
```

### B. Executar Migrações do Prisma

Após o deploy, execute as migrações no banco de produção:

```bash
# Localmente, apontando para o banco de produção
DATABASE_URL="sua-connection-string" npx prisma migrate deploy
```

**OU** configure um script no `package.json`:

```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

### C. Fazer Deploy

```bash
git add .
git commit -m "Configure production environment"
git push origin main
```

A Vercel fará deploy automaticamente.

---

## 🎯 4. Deploy na Netlify

### A. Configurar Variáveis de Ambiente

1. Acesse: https://app.netlify.com
2. Selecione seu site
3. Vá em **Site settings** → **Environment variables**
4. Adicione as mesmas variáveis da Vercel

### B. Configurar Build Settings

Crie o arquivo `netlify.toml` na raiz do projeto:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### C. Instalar Plugin Next.js

```bash
npm install --save-dev @netlify/plugin-nextjs
```

### D. Fazer Deploy

```bash
git add .
git commit -m "Configure Netlify deployment"
git push origin main
```

---

## ✅ 5. Verificar Deploy

1. Acesse a URL do seu deploy
2. Teste o login com Google
3. Verifique se o dashboard carrega
4. Teste criar uma transação

---

## 🐛 Troubleshooting

### Erro: "Environment Variable does not exist"
- Certifique-se de adicionar TODAS as variáveis de ambiente
- Verifique se não há espaços extras nos valores
- Faça um novo deploy após adicionar variáveis

### Erro: "Prisma Client not generated"
- Adicione `prisma generate` ao script de build
- Certifique-se que `@prisma/client` está em `dependencies` (não em `devDependencies`)

### Erro: "Invalid DATABASE_URL"
- Verifique se a connection string está completa
- Para Neon/Supabase, adicione `?sslmode=require` no final
- Teste a conexão localmente primeiro

### Login Google não funciona
- Verifique se as URLs de callback estão corretas no Google Console
- Confirme que `NEXTAUTH_URL` corresponde ao domínio de produção
- Certifique-se que `NEXTAUTH_SECRET` está definido

---

## 📊 6. Monitoramento

### Vercel
- Logs: https://vercel.com/seu-projeto/logs
- Analytics: https://vercel.com/seu-projeto/analytics

### Netlify
- Logs: Site settings → Build & deploy → Deploy log
- Functions: Functions → Function logs

---

## 🔄 7. Configuração Recomendada Final

### package.json (ajustar scripts)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate"
  }
}
```

### Mover @prisma/client para dependencies

Certifique-se que está em `dependencies`, não `devDependencies`:

```json
{
  "dependencies": {
    "@prisma/client": "^6.19.0",
    // ... outras dependências
  },
  "devDependencies": {
    "prisma": "^6.19.0",
    // ... outras dev dependencies
  }
}
```

---

## 🎉 Pronto!

Seu projeto estará disponível em produção. Qualquer dúvida, consulte a documentação oficial:

- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
- Prisma: https://www.prisma.io/docs
- NextAuth: https://next-auth.js.org/deployment
