"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function TestApiPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testRegister = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      console.log("=== TESTE DE REGISTRO ===")
      const API_URL = 'http://localhost:4000/api'
      const url = `${API_URL}/auth/register`
      
      console.log("URL:", url)
      
      const payload = {
        username: `test_${Date.now()}`,
        firstName: "Test",
        lastName: "User",
        email: `test${Date.now()}@test.com`,
        password: "senha123"
      }
      
      console.log("Payload:", payload)
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
      
      console.log("Status:", response.status)
      
      const text = await response.text()
      console.log("Response text:", text)
      
      const data = JSON.parse(text)
      
      setResult({
        success: response.ok,
        status: response.status,
        data: data
      })
    } catch (error: any) {
      console.error("Erro:", error)
      setResult({
        success: false,
        error: error.message,
        stack: error.stack
      })
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      console.log("=== TESTE DE LOGIN ===")
      const API_URL = 'http://localhost:4000/api'
      const url = `${API_URL}/auth/login`
      
      console.log("URL:", url)
      
      const payload = {
        email: "teste@teste.com",
        password: "senha123"
      }
      
      console.log("Payload:", payload)
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
      
      console.log("Status:", response.status)
      
      const text = await response.text()
      console.log("Response text:", text)
      
      const data = JSON.parse(text)
      
      setResult({
        success: response.ok,
        status: response.status,
        data: data
      })
    } catch (error: any) {
      console.error("Erro:", error)
      setResult({
        success: false,
        error: error.message,
        stack: error.stack
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Teste de API</h1>
        
        <div className="space-y-4 mb-8">
          <Button 
            onClick={testRegister} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Testando..." : "Testar Registro"}
          </Button>
          
          <Button 
            onClick={testLogin} 
            disabled={loading}
            className="w-full"
            variant="outline"
          >
            {loading ? "Testando..." : "Testar Login"}
          </Button>
        </div>
        
        {result && (
          <div className="bg-gray-900 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Resultado:</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="mt-8 bg-gray-900 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Instruções:</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Abra o Console do navegador (F12 → Console)</li>
            <li>Clique em um dos botões acima</li>
            <li>Veja os logs no console e o resultado na tela</li>
            <li>Se der erro, copie a mensagem completa</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
