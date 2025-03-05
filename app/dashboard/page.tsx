import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { BalanceCard } from "@/components/dashboard/balance-card"
import { ExpensesChart } from "@/components/dashboard/expenses-chart"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { ExpensesByCategory } from "@/components/dashboard/expenses-by-category"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Visualize e gerencie suas finanças." />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <BalanceCard title="Saldo" amount={2700} icon="wallet" />
        <BalanceCard title="Investido" amount={3500} icon="trending-up" />
        <BalanceCard title="Receita" amount={8150} icon="arrow-up-right" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <ExpensesChart />
          <ExpensesByCategory />
        </div>
        <RecentTransactions />
      </div>
    </DashboardShell>
  )
}

