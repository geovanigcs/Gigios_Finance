const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Função para gerar uma data aleatória nos últimos 3 meses
function randomDate(start = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), end = new Date()) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Função para gerar um valor aleatório entre min e max
function randomAmount(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

async function main() {
  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'usuario@exemplo.com' },
    update: {},
    create: {
      email: 'usuario@exemplo.com',
      name: 'Usuário Teste',
      image: 'https://github.com/shadcn.png',
    },
  });

  console.log(`Usuário criado: ${user.name}`);

  // Limpar transações existentes do usuário
  await prisma.transaction.deleteMany({
    where: { userId: user.id }
  });

  // Data atual para transações recentes
  const currentDate = new Date();
  const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const lastMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
  
  // Arrays de possíveis valores para gerar transações aleatórias
  const expenseCategories = ['housing', 'utilities', 'groceries', 'food', 'transport', 'health', 'entertainment', 'education', 'clothing', 'travel', 'pets', 'gifts', 'personal'];
  const expenseTitles = {
    'housing': ['Aluguel', 'Condomínio', 'IPTU', 'Manutenção casa'],
    'utilities': ['Conta de luz', 'Conta de água', 'Internet', 'Telefone', 'Gás'],
    'groceries': ['Supermercado', 'Feira', 'Atacadão', 'Mercado local'],
    'food': ['Restaurante', 'Delivery', 'Lanche', 'Café', 'Pizza'],
    'transport': ['Combustível', 'Uber', '99', 'Metrô', 'Ônibus', 'Estacionamento', 'IPVA'],
    'health': ['Academia', 'Farmácia', 'Consulta médica', 'Dentista', 'Plano de saúde'],
    'entertainment': ['Streaming', 'Cinema', 'Show', 'Jogos', 'Assinatura revista'],
    'education': ['Curso online', 'Livros', 'Material escolar', 'Mensalidade faculdade'],
    'clothing': ['Roupas', 'Calçados', 'Acessórios'],
    'travel': ['Passagem aérea', 'Hotel', 'Passeios'],
    'pets': ['Ração', 'Veterinário', 'Petshop'],
    'gifts': ['Presente aniversário', 'Presente Natal'],
    'personal': ['Cabeleireiro', 'Manicure', 'Produtos de beleza']
  };
  
  const incomeTitles = ['Salário', 'Freelance', 'Reembolso', 'Bônus', 'Dividendos', 'Venda item usado', 'Aluguel recebido', 'Presente'];
  const investmentTypes = ['national', 'international', 'crypto', 'stocks', 'realestate'];
  const investmentTitles = {
    'national': ['Tesouro Direto', 'CDB', 'LCI', 'LCA', 'Fundos de Investimento', 'Poupança'],
    'international': ['ETF S&P 500', 'Ações internacionais', 'Fundos internacionais'],
    'crypto': ['Bitcoin', 'Ethereum', 'Solana', 'Cardano', 'Polkadot'],
    'stocks': ['Ações PETR4', 'Ações VALE3', 'Ações ITUB4', 'Ações MGLU3', 'Ações WEGE3'],
    'realestate': ['Fundo Imobiliário', 'Financiamento imóvel', 'Compra terreno']
  };
  const paymentMethods = ['pix', 'card', 'boleto', 'cash', 'transfer', 'crypto'];

  // Criar transações de exemplo do mês atual (com as categorias mencionadas)
  const baseTransactions = [
    // Receitas do mês atual
    {
      title: 'Salário',
      amount: 5200.00,
      type: 'income',
      method: 'transfer',
      category: 'salary',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5),
      userId: user.id,
    },
    {
      title: 'Freelancing',
      amount: 1800.00,
      type: 'income',
      method: 'pix',
      category: 'freelancing',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 12),
      userId: user.id,
    },
    
    // Despesas do mês atual
    {
      title: 'Aluguel',
      amount: 1500.00,
      type: 'expense',
      method: 'transfer',
      category: 'rent',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      userId: user.id,
    },
    {
      title: 'Mercado',
      amount: 650.00,
      type: 'expense',
      method: 'card',
      category: 'market',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      userId: user.id,
    },
    {
      title: 'Uber',
      amount: 120.50,
      type: 'expense',
      method: 'card',
      category: 'uber',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      userId: user.id,
    },
    
    // Investimentos do mês atual
    {
      title: 'Bitcoin',
      amount: 1000.00,
      type: 'investment',
      method: 'crypto',
      category: 'bitcoin',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      userId: user.id,
    },
    {
      title: 'CDB',
      amount: 2000.00,
      type: 'investment',
      method: 'transfer',
      category: 'cdb',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20),
      userId: user.id,
    },
    
    // ========= TRANSAÇÕES DO MÊS ANTERIOR =========
    // Receitas do mês anterior
    {
      title: 'Salário',
      amount: 5200.00,
      type: 'income',
      method: 'transfer',
      category: 'salary',
      date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 5),
      userId: user.id,
    },
    {
      title: 'Freelancing',
      amount: 1500.00,
      type: 'income',
      method: 'pix',
      category: 'freelancing',
      date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 15),
      userId: user.id,
    },
    
    // Despesas do mês anterior
    {
      title: 'Aluguel',
      amount: 1500.00,
      type: 'expense',
      method: 'transfer',
      category: 'rent',
      date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 8),
      userId: user.id,
    },
    {
      title: 'Mercado',
      amount: 580.00,
      type: 'expense',
      method: 'card',
      category: 'market',
      date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 12),
      userId: user.id,
    },
    {
      title: 'Uber',
      amount: 95.30,
      type: 'expense',
      method: 'card',
      category: 'uber',
      date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 18),
      userId: user.id,
    },
    
    // Investimentos do mês anterior
    {
      title: 'Bitcoin',
      amount: 800.00,
      type: 'investment',
      method: 'crypto',
      category: 'bitcoin',
      date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 20),
      userId: user.id,
    },
    {
      title: 'CDB',
      amount: 1500.00,
      type: 'investment',
      method: 'transfer',
      category: 'cdb',
      date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 25),
      userId: user.id,
    }
  ];

  // Usar apenas as transações base (sem transações aleatórias)
  const allTransactions = baseTransactions;

  // Criar todas as transações no banco de dados
  for (const transaction of allTransactions) {
    await prisma.transaction.create({
      data: transaction,
    });
  }

  console.log(`Criadas ${allTransactions.length} transações`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });