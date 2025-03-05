import { Button } from "@/components/ui/button"
import { Leaf } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <div className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-16 md:px-6 md:py-24 lg:px-8">
        <div className="flex items-center gap-2 text-3xl font-bold text-white">
          <Leaf className="h-8 w-8 text-blue-500" />
          <span>Gigio's Finance</span>
        </div>

        <div className="mt-12 max-w-md text-center">
          <h1 className="text-4xl font-bold tracking-tight">Bem-vindo</h1>
          <p className="mt-4 text-lg text-gray-400">
            A Finance AI é uma plataforma de gestão financeira que utiliza IA para monitorar suas movimentações, e
            oferecer insights personalizados, facilitando o controle do seu orçamento.
          </p>
        </div>

        <div className="mt-8 w-full max-w-md space-y-4">
          <Button asChild className="w-full bg-gray-800 hover:bg-gray-700">
            <Link href="/dashboard">
              <Image src="/google-logo.svg" alt="Google" width={20} height={20} className="mr-2" />
              Entrar com Google
            </Link>
          </Button>
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
            <Link href="/dashboard">Entrar sem login</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

