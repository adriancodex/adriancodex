"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AlertCircle, X } from "lucide-react"
import type { PrioridadeChamado, CategoriaChamado } from "../../types"
import { useAuth } from "../../contexts/AuthContext"
import { useTickets } from "../../contexts/TicketContext"

const TicketForm: React.FC = () => {
  const { currentUser } = useAuth()
  const { createTicket } = useTickets()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    prioridade: "media" as PrioridadeChamado,
    categoria: "software" as CategoriaChamado,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Limpar erro para este campo quando o usuário o altera
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.titulo.trim()) {
      newErrors.titulo = "O título é obrigatório"
    } else if (formData.titulo.length < 5) {
      newErrors.titulo = "O título deve ter pelo menos 5 caracteres"
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = "A descrição é obrigatória"
    } else if (formData.descricao.length < 10) {
      newErrors.descricao = "A descrição deve ter pelo menos 10 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setIsSubmitting(true)
      setSubmitError(null)

      if (!currentUser) {
        throw new Error("Você precisa estar logado para criar um chamado")
      }

      const newTicket = await createTicket({
        ...formData,
        status: "aberto",
        criadoPor: currentUser.id,
      })

      // Mostrar mensagem de sucesso ou redirecionar
      navigate(`/tickets/${newTicket.id}`)
    } catch (error) {
      console.error("Falha ao criar chamado:", error)
      setSubmitError(error instanceof Error ? error.message : "Falha ao criar chamado. Por favor, tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Solicite um novo chamado</h3>
      </div>

      <div className="p-5">
        {/* Resumo de erros */}
        {submitError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
            <button type="button" className="ml-auto -mx-1.5 -my-1.5 p-1.5" onClick={() => setSubmitError(null)}>
              <X className="h-4 w-4 text-red-500" />
            </button>
          </div>
        )}

        {/* Título */}
        <div className="mb-4">
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
            Título
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            className={`w-full rounded-md shadow-sm ${errors.titulo ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"}`}
            placeholder="Em que podemos ajudar?"
            value={formData.titulo}
            onChange={handleChange}
          />
          {errors.titulo && <p className="mt-1 text-sm text-red-600">{errors.titulo}</p>}
        </div>

        {/* Descrição */}
        <div className="mb-4">
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            id="descricao"
            name="descricao"
            rows={4}
            className={`w-full rounded-md shadow-sm ${errors.descricao ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"}`}
            placeholder="Escreva uma descrição detalhada do problema"
            value={formData.descricao}
            onChange={handleChange}
          />
          {errors.descricao && <p className="mt-1 text-sm text-red-600">{errors.descricao}</p>}
        </div>

        {/* Categoria e Prioridade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              id="categoria"
              name="categoria"
              className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={formData.categoria}
              onChange={handleChange}
            >
              <option value="hardware">Hardware</option>
              <option value="software">Software</option>
              <option value="rede">Internet</option>
              <option value="acesso">Acesso</option>
              <option value="outro">Outros</option>
            </select>
          </div>

          <div>
            <label htmlFor="prioridade" className="block text-sm font-medium text-gray-700 mb-1">
              Prioridade
            </label>
            <select
              id="prioridade"
              name="prioridade"
              className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={formData.prioridade}
              onChange={handleChange}
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
              <option value="critica">Crítica</option>
            </select>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
          onClick={() => navigate(-1)}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Criando..." : "Criar Chamado"}
        </button>
      </div>
    </form>
  )
}

export default TicketForm
