"use client"

import type React from "react"

import { useState } from "react"
import { SiteHeader } from "@/components/layout/site-header"
import { TransactionsSidebar } from "@/components/dashboard/transactions-sidebar"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1 flex">
        <main
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out",
            sidebarOpen ? "mr-[30%] lg:mr-[25%]" : "mr-0",
          )}
        >
          <div className="container py-6">{children}</div>
        </main>

        <TransactionsSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      </div>
    </div>
  )
}

