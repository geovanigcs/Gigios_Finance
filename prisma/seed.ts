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

  // Data atual para transações recentes
  const currentDate = new Date();
  
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

  // Criar transações de exemplo
  const baseTransactions = [
    // Receitas fixas mensais
    {
      title: 'Salário',
      amount: 4850.75,
      type: 'income',
      method: 'pix',
      category: 'salary',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5),
      userId: user.id,
    },
    {
      title: 'Freelance Design',
      amount: 1200.00,
      type: 'income',
      method: 'transfer',
      category: 'freelance',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      userId: user.id,
    },
    {
      title: 'Reembolso despesas',
      amount: 320.50,
      type: 'income',
      method: 'pix',
      category: 'reimbursement',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      userId: user.id,
    },
    
    // Despesas fixas mensais
    {
      title: 'Aluguel',
      amount: 1350.00,
      type: 'expense',
      method: 'transfer',
      category: 'housing',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5),
      userId: user.id,
    },
    {
      title: 'Conta de luz',
      amount: 187.32,
      type: 'expense',
      method: 'boleto',
      category: 'utilities',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      userId: user.id,
    },
    {
      title: 'Internet',
      amount: 129.90,
      type: 'expense',
      method: 'card',
      category: 'utilities',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      userId: user.id,
    },
    {
      title: 'Supermercado',
      amount: 432.75,
      type: 'expense',
      method: 'card',
      category: 'groceries',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 12),
      userId: user.id,
    },
    {
      title: 'Restaurante',
      amount: 98.50,
      type: 'expense',
      method: 'card',
      category: 'food',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 14),
      userId: user.id,
    },
    {
      title: 'Combustível',
      amount: 150.00,
      type: 'expense',
      method: 'card',
      category: 'transport',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 16),
      userId: user.id,
    },
    {
      title: 'Academia',
      amount: 89.90,
      type: 'expense',
      method: 'card',
      category: 'health',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5),
      userId: user.id,
    },
    {
      title: 'Streaming',
      amount: 55.90,
      type: 'expense',
      method: 'card',
      category: 'entertainment',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 7),
      userId: user.id,
    },
    
    // Investimentos fixos mensais
    {
      title: 'Tesouro Direto',
      amount: 500.00,
      type: 'investment',
      method: 'transfer',
      category: 'investment',
      investmentType: 'national',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      userId: user.id,
    },
    {
      title: 'Ações PETR4',
      amount: 750.00,
      type: 'investment',
      method: 'transfer',
      category: 'investment',
      investmentType: 'stocks',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      userId: user.id,
    },
    {
      title: 'ETF S&P 500',
      amount: 1000.00,
      type: 'investment',
      method: 'transfer',
      category: 'investment',
      investmentType: 'international',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      userId: user.id,
    },
    {
      title: 'Bitcoin',
      amount: 600.00,
      type: 'investment',
      method: 'crypto',
      category: 'investment',
      investmentType: 'crypto',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20),
      userId: user.id,
    },
    {
      title: 'Fundo Imobiliário',
      amount: 1200.00,
      type: 'investment',
      method: 'transfer',
      category: 'investment',
      investmentType: 'realestate',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 22),
      userId: user.id,
    }
  ];

  // Gerar transações aleatórias adicionais (50 transações)
  const randomTransactions = [];
  
  // Adicionar 20 despesas aleatórias
  for (let i = 0; i < 20; i++) {
    const category = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
    const titles = expenseTitles[category];
    const title = titles[Math.floor(Math.random() * titles.length)];
    
    randomTransactions.push({
      title,
      amount: randomAmount(10, 500),
      type: 'expense',
      method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      category,
      date: randomDate(),
      userId: user.id,
    });
  }
  
  // Adicionar 10 receitas aleatórias
  for (let i = 0; i < 10; i++) {
    randomTransactions.push({
      title: incomeTitles[Math.floor(Math.random() * incomeTitles.length)],
      amount: randomAmount(100, 2000),
      type: 'income',
      method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      category: 'income',
      date: randomDate(),
      userId: user.id,
    });
  }
  
  // Adicionar 15 investimentos aleatórios
  for (let i = 0; i < 15; i++) {
    const investmentType = investmentTypes[Math.floor(Math.random() * investmentTypes.length)];
    const titles = investmentTitles[investmentType];
    const title = titles[Math.floor(Math.random() * titles.length)];
    
    randomTransactions.push({
      title,
      amount: randomAmount(100, 3000),
      type: 'investment',
      method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      category: 'investment',
      investmentType,
      date: randomDate(),
      userId: user.id,
    });
  }
  
  // Combinar transações base com transações aleatórias
  const allTransactions = [...baseTransactions, ...randomTransactions];

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