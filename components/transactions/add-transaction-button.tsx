"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog"

export function AddTransactionButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700">
        <PlusCircle className="mr-2 h-4 w-4" />
        Adicionar Transação
      </Button>
      <AddTransactionDialog open={open} onOpenChange={setOpen} />
    </>
  )
}

