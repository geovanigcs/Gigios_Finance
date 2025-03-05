"use client"

import Link from "next/link"
import { Brain, Info } from "lucide-react"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/layout/mobile-nav"
import { AboutDialog } from "@/components/about-dialog"
import { useState } from "react"

export function SiteHeader() {
  const [showAboutDialog, setShowAboutDialog] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2 text-xl font-bold">
          <Brain className="h-6 w-6 text-blue-500" />
          <span>FinanceIA Gigio's</span>
        </div>

        <nav className="mx-6 flex items-center space-x-4 lg:space-x-6 hidden md:block">
          <Button asChild variant="ghost">
            <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-blue-500">
              Dashboard
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/transactions" className="text-sm font-medium transition-colors hover:text-blue-500">
              Transações
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/subscription" className="text-sm font-medium transition-colors hover:text-blue-500">
              Assinatura
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-blue-500">
              Sobre
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-sm font-medium transition-colors hover:text-blue-500"
            onClick={() => setShowAboutDialog(true)}
          >
            <Info className="h-5 w-5" />
          </Button>
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
          <MobileNav className="md:hidden" />
        </div>
      </div>

      <AboutDialog open={showAboutDialog} onOpenChange={setShowAboutDialog} />
    </header>
  )
}

