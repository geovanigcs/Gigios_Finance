import Link from "next/link"
import { Leaf } from "lucide-react"
import { UserNav } from "@/components/user-nav"

export function SiteHeader() {
  return (
    <header className="sticky w-full top-0 bg-background/20 backdrop-blur-md flex max-w-7x1 mx-auto z-10 xl:items-center">
      <div className="container flex h-16 items-center">
        <div className="flex items-center mx-3 flex-row gap-2 text-xl font-bold text-white">
          <Leaf className="h-6 w-6 text-blue-500" />
          <span>finance.ai</span>
        </div>
        <nav className="flex-row flex max-w-7xl items-center justify-end gap-6 lg:px-8 test-sm font-medium">
          <Link href="/dashboard" className="transition-colors hover:text-blue-500">
            Dashboard
          </Link>
          <Link href="/transactions" className="transition-colors hover:text-blue-400">
            Transações
          </Link>
          <Link href="/subscription" className="transition-colors hover:text-blue-500">
            Assinatura
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <UserNav />
        </div>
      </div>
    </header>
  )
}

