// Validação de variáveis de ambiente necessárias

const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
] as const

const optionalEnvVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
] as const

export function validateEnv() {
  const missing: string[] = []
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar)
    }
  }
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and make sure all required variables are set.'
    )
  }
  
  // Avisos para variáveis opcionais
  const missingOptional: string[] = []
  for (const envVar of optionalEnvVars) {
    if (!process.env[envVar]) {
      missingOptional.push(envVar)
    }
  }
  
  if (missingOptional.length > 0 && process.env.NODE_ENV !== 'production') {
    console.warn(
      `⚠️  Optional environment variables not set: ${missingOptional.join(', ')}\n` +
      'Some features may not be available.'
    )
  }
}

// Validar no carregamento do módulo apenas em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  try {
    validateEnv()
  } catch (error) {
    console.error('❌ Environment validation failed:', error)
  }
}
