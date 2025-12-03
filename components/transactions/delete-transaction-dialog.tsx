"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DeleteTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DeleteTransactionDialog({ open, onOpenChange, onConfirm }: DeleteTransactionDialogProps) {
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleDelete = async () => {
    try {
      setLoading(true)
      // Simular delay da API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Aqui você implementaria a chamada real para sua API
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        onConfirm()
      }, 1500)
    } catch (error) {
      console.error("Erro ao deletar transação:", error)
    } finally {
      setLoading(false)
    }
  }

  if (showSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <Alert className="border-0 bg-blue-500/10">
            <AlertDescription className="text-blue-500">A transação foi deletada do sistema.</AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Deseja deletar essa transação?</DialogTitle>
          <DialogDescription className="text-gray-400">Uma vez deletada não poderá recuperá-la.</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-gray-800 border-gray-700 hover:bg-gray-700"
          >
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Deletar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

