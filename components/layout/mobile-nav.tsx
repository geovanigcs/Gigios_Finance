"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  className?: string
}

export function MobileNav({ className }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("md:hidden", className)}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-gray-900 border-gray-800 pt-10">
        <nav className="flex flex-col gap-4">
          <Link
            href="/dashboard"
            className="text-lg font-medium transition-colors hover:text-blue-500"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/transactions"
            className="text-lg font-medium transition-colors hover:text-blue-500"
            onClick={() => setOpen(false)}
          >
            Transações
          </Link>
          <Link
            href="/subscription"
            className="text-lg font-medium transition-colors hover:text-blue-500"
            onClick={() => setOpen(false)}
          >
            Assinatura
          </Link>
          <Link
            href="/about"
            className="text-lg font-medium transition-colors hover:text-blue-500"
            onClick={() => setOpen(false)}
          >
            Sobre
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

