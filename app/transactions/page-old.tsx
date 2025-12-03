import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TransactionsTable } from "@/components/transactions/transactions-table"
import { AddTransactionButton } from "@/components/transactions/add-transaction-button"

export default function TransactionsPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <DashboardHeader heading="Transações" text="Gerencie suas transações financeiras." />
        <AddTransactionButton />
      </div>
      <TransactionsTable />
    </DashboardShell>
  )
}

