import type React from "react"
import { Link } from "react-router-dom"
import type { Chamado } from "../../types"
import { obterTempoRelativo, obterCorStatus, obterCorPrioridade, obterIconeCategoria } from "../../utils/helpers"
import * as LucideIcons from "lucide-react"

interface RecentTicketsProps {
  tickets: Chamado[]
}

const RecentTickets: React.FC<RecentTicketsProps> = ({ tickets }) => {
  // Sort tickets by creation date, newest first
  const sortedTickets = [...tickets]
    .sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime())
    .slice(0, 5) // Take only the 5 most recent tickets

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Chamados Recentes</h3>
      </div>

      <div className="divide-y divide-gray-200">
        {sortedTickets.length === 0 ? (
          <div className="p-5 text-center text-gray-500">Nenhum chamado encontrado</div>
        ) : (
          sortedTickets.map((ticket) => {
            const IconComponent = LucideIcons[
              obterIconeCategoria(ticket.categoria) as keyof typeof LucideIcons
            ] as React.FC<{ className?: string }>

            return (
              <div key={ticket.id} className="p-5 hover:bg-gray-50 transition-colors duration-150">
                <Link to={`/tickets/${ticket.id}`} className="block">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        {IconComponent && <IconComponent className="h-5 w-5 text-blue-600" />}
                      </span>
                    </div>

                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-medium text-gray-900 truncate">{ticket.titulo}</h4>
                        <span className="text-sm text-gray-500">{obterTempoRelativo(ticket.dataCriacao)}</span>
                      </div>

                      <p className="mt-1 text-sm text-gray-600 line-clamp-1">{ticket.descricao}</p>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${obterCorStatus(ticket.status)}`}
                        >
                          {ticket.status.replace("-", " ")}
                        </span>

                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${obterCorPrioridade(ticket.prioridade)}`}
                        >
                          {ticket.prioridade}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })
        )}
      </div>

      <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
        <Link to="/tickets" className="text-sm font-medium text-blue-600 hover:text-blue-500">
          Ver todos os chamados
        </Link>
      </div>
    </div>
  )
}

export default RecentTickets
