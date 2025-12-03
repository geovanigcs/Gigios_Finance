export interface TransactionCategory {
  id: string
  name: string
  emoji: string
  type: "income" | "expense" | "investment"
  description?: string
}

export const TRANSACTION_CATEGORIES: TransactionCategory[] = [
  // Receitas
  {
    id: "salary",
    name: "Salário",
    emoji: "💰",
    type: "income",
    description: "Salário mensal"
  },
  {
    id: "freelancing",
    name: "Freelancing",
    emoji: "💼",
    type: "income",
    description: "Trabalhos freelance"
  },
  
  // Despesas
  {
    id: "rent",
    name: "Aluguel",
    emoji: "🏠",
    type: "expense",
    description: "Aluguel mensal"
  },
  {
    id: "market",
    name: "Mercado",
    emoji: "🛒",
    type: "expense",
    description: "Compras de supermercado"
  },
  {
    id: "uber",
    name: "Uber",
    emoji: "🚗",
    type: "expense",
    description: "Transporte por aplicativo"
  },
  
  // Investimentos
  {
    id: "bitcoin",
    name: "Bitcoin",
    emoji: "₿",
    type: "investment",
    description: "Criptomoeda Bitcoin"
  },
  {
    id: "cdb",
    name: "CDB",
    emoji: "📈",
    type: "investment",
    description: "Certificado de Depósito Bancário"
  },
]

export const getCategoryById = (id: string) => {
  return TRANSACTION_CATEGORIES.find(cat => cat.id === id)
}

export const getCategoriesByType = (type: "income" | "expense" | "investment") => {
  return TRANSACTION_CATEGORIES.filter(cat => cat.type === type)
}
