"use client"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { TransactionDialog } from "@/components/transactions/transaction-dialog"
import { DeleteTransactionDialog } from "@/components/transactions/delete-transaction-dialog"

// Dados de exemplo expandidos com mais tipos de transações
const transactions = [
  {
    id: "1",
    name: "Salário",
    type: "income",
    category: 'Trabalho',
    method: "PIX",
    date: "28 de Março 2023",
    amount: 1750,
  },
  {
    id: "2",
    name: "Aluguel",
    type: "expense",
    category: "Moradia",
    method: "PIX",
    date: "28 de Março 2023",
    amount: 1750,
  },
  {
    id: "3",
    name: "Mercado",
    type: "expense",
    category: "Alimentação",
    method: "Cartão",
    date: "28 de Março 2023",
    amount: 1750,
  },
  {
    id: "4",
    name: "Bitcoin",
    type: "investment",
    category: "Dividendo",
    investmentType: "crypto",
    method: "PIX",
    date: "28 de Março 2023",
    amount: 1750,
  },
  {
    id: "5",
    name: "Freelancing",
    type: "income",
    category: "Trabalho",
    method: "Boleto",
    date: "28 de Março 2023",
    amount: 1750,
  },
  {
    id: "6",
    name: "Uber",
    type: "expense",
    category: "Transporte",
    method: "PIX",
    date: "28 de Março 2023",
    amount: 1750,
  },
  {
    id: "7",
    name: "Ações PETR4",
    type: "investment",
    category: "Dividendo",
    investmentType: "national",
    method: "Transferência",
    date: "28 de Março 2023",
    amount: 2500,
  },
  {
    id: "8",
    name: "ETF S&P 500",
    type: "investment",
    category: "Dividendo",
    investmentType: "international",
    method: "Transferência",
    date: "28 de Março 2023",
    amount: 3200,
  },
]

export function TransactionsTable() {
  const [editingTransaction, setEditingTransaction] = useState<any>(null)
  const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getTypeLabel = (type: string, investmentType?: string) => {
    switch (type) {
      case "income":
        return <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">Ganho</Badge>
      case "expense":
        return <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/30">Gasto</Badge>
      case "investment":
        if (investmentType === "national") {
          return <Badge className="bg-purple-500/20 text-purple-500 hover:bg-purple-500/30">Inv. Nacional</Badge>
        } else if (investmentType === "international") {
          return <Badge className="bg-indigo-500/20 text-indigo-500 hover:bg-indigo-500/30">Inv. Internacional</Badge>
        } else if (investmentType === "crypto") {
          return <Badge className="bg-orange-500/20 text-orange-500 hover:bg-orange-500/30">Criptomoeda</Badge>
        }
        return <Badge className="bg-gray-500/20 text-gray-400 hover:bg-gray-500/30">Investimento</Badge>
      default:
        return null
    }
  }

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setDeletingTransactionId(id)
    setIsDeleteDialogOpen(true)
  }

  return (
    <>
      <div className="rounded-md border border-gray-800 bg-gray-900">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-gray-800/50">
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id} className="hover:bg-gray-800/50">
                <TableCell className="font-medium">{transaction.name}</TableCell>
                <TableCell>{getTypeLabel(transaction.type, transaction.investmentType)}</TableCell>
                <TableCell>{transaction.category || "-"}</TableCell>
                <TableCell>{transaction.method}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell
                  className={`text-right ${
                    transaction.type === "income"
                      ? "text-green-500"
                      : transaction.type === "expense"
                        ? "text-red-500"
                        : "text-gray-400"
                  }`}
                >
                  {formatCurrency(transaction.amount)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(transaction)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDelete(transaction.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo de edição */}
      {editingTransaction && (
        <TransactionDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          transaction={{
            id: editingTransaction.id,
            title: editingTransaction.name,
            amount: editingTransaction.amount,
            type: editingTransaction.type,
            method: editingTransaction.method,
            category: editingTransaction.category,
            investmentType: editingTransaction.investmentType,
            date: new Date(),
          }}
        />
      )}

      {/* Diálogo de exclusão */}
      <DeleteTransactionDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => {
          console.log(`Transação ${deletingTransactionId} excluída`)
          setIsDeleteDialogOpen(false)
        }}
      />
    </>
  )
}

