"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, Filter } from "lucide-react"
import type { Chamado, StatusChamado, PrioridadeChamado, CategoriaChamado } from "../../types"
import {
  formatarData,
  obterCorStatus,
  obterCorPrioridade,
  obterIconeCategoria,
  pesquisarChamados,
} from "../../utils/helpers"
import * as LucideIcons from "lucide-react"

interface TicketListProps {
  tickets: Chamado[]
  loading?: boolean
}

const StatusIcon: React.FC<{ status: StatusChamado }> = ({ status }) => {
  switch (status) {
    case "aberto":
      return <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
    case "em-andamento":
      return <span className="h-2 w-2 bg-amber-500 rounded-full"></span>
    case "resolvido":
      return <span className="h-2 w-2 bg-green-500 rounded-full"></span>
    case "fechado":
      return <span className="h-2 w-2 bg-gray-500 rounded-full"></span>
    default:
      return null
  }
}

const CategoryIcon: React.FC<{ category: CategoriaChamado }> = ({ category }) => {
  const IconComponent = LucideIcons[obterIconeCategoria(category) as keyof typeof LucideIcons] as React.FC<{
    className?: string
  }>

  return IconComponent ? <IconComponent className="h-5 w-5 text-gray-500" /> : null
}

const TicketList: React.FC<TicketListProps> = ({ tickets, loading = false }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTickets, setFilteredTickets] = useState<Chamado[]>(tickets)
  const [filters, setFilters] = useState({
    status: [] as StatusChamado[],
    priority: [] as PrioridadeChamado[],
    category: [] as CategoriaChamado[],
  })
  const [showFilters, setShowFilters] = useState(false)

  // Update filtered tickets when tickets, search query, or filters change
  useEffect(() => {
    let result = tickets

    // Apply search
    if (searchQuery) {
      result = pesquisarChamados(result, searchQuery)
    }

    // Apply filters
    if (filters.status.length > 0) {
      result = result.filter((ticket) => filters.status.includes(ticket.status))
    }

    if (filters.priority.length > 0) {
      result = result.filter((ticket) => filters.priority.includes(ticket.prioridade))
    }

    if (filters.category.length > 0) {
      result = result.filter((ticket) => filters.category.includes(ticket.categoria))
    }

    setFilteredTickets(result)
  }, [tickets, searchQuery, filters])

  const toggleFilter = (type: "status" | "priority" | "category", value: any) => {
    setFilters((prev) => {
      const currentValues = prev[type]
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value]

      return { ...prev, [type]: newValues }
    })
  }

  const clearFilters = () => {
    setFilters({
      status: [],
      priority: [],
      category: [],
    })
    setSearchQuery("")
  }

  const hasActiveFilters = () => {
    return (
      filters.status.length > 0 || filters.priority.length > 0 || filters.category.length > 0 || searchQuery.length > 0
    )
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Chamados</h3>

        <div className="flex items-center mt-2 sm:mt-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar chamados..."
              className="form-input pl-10 pr-4 py-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            type="button"
            className={`ml-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md ${showFilters ? "bg-gray-100 text-gray-900" : "bg-white text-gray-700"} hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-1" />
            Filtros
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            <div>
              <p className="text-sm font-medium text-gray-700">Status:</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {(["aberto", "em-andamento", "resolvido", "fechado"] as StatusChamado[]).map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${
                      filters.status.includes(status)
                        ? obterCorStatus(status)
                        : "bg-white border border-gray-300 text-gray-700"
                    }`}
                    onClick={() => toggleFilter("status", status)}
                  >
                    {status.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="ml-4">
              <p className="text-sm font-medium text-gray-700">Prioridade:</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {(["baixa", "media", "alta", "critica"] as PrioridadeChamado[]).map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${
                      filters.priority.includes(priority)
                        ? obterCorPrioridade(priority)
                        : "bg-white border border-gray-300 text-gray-700"
                    }`}
                    onClick={() => toggleFilter("priority", priority)}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            <div className="ml-4">
              <p className="text-sm font-medium text-gray-700">Categoria:</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {(["hardware", "software", "rede", "acesso", "outro"] as CategoriaChamado[]).map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${
                      filters.category.includes(category)
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : "bg-white border border-gray-300 text-gray-700"
                    }`}
                    onClick={() => toggleFilter("category", category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {hasActiveFilters() && (
              <button
                type="button"
                className="ml-auto mt-auto inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={clearFilters}
              >
                Limpar Filtros
              </button>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="p-5 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-8 bg-blue-200 rounded-full mb-4"></div>
            <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="p-5 text-center text-gray-500">
          {hasActiveFilters()
            ? "Nenhum chamado corresponde à sua busca ou filtros. Tente ajustar seus critérios."
            : "Nenhum chamado encontrado. Crie um novo chamado para começar."}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Chamado
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Categoria
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Prioridade
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Criado
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Atualizado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <StatusIcon status={ticket.status} />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/tickets/${ticket.id}`} className="hover:text-blue-600">
                      <div className="text-sm font-medium text-gray-900">{ticket.titulo}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{ticket.descricao}</div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CategoryIcon category={ticket.categoria} />
                      <span className="ml-2 text-sm text-gray-900 capitalize">{ticket.categoria}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${obterCorPrioridade(ticket.prioridade)}`}
                    >
                      {ticket.prioridade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatarData(ticket.dataCriacao)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatarData(ticket.dataAtualizacao)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <span className="text-sm text-gray-700">
          Mostrando <span className="font-medium">{filteredTickets.length}</span> de{" "}
          <span className="font-medium">{tickets.length}</span> chamados
        </span>

        <Link
          to="/tickets/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Novo Chamado
        </Link>
      </div>
    </div>
  )
}

export default TicketList
