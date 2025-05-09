"use client"

import React from "react"
import { useState } from "react"
import { Clock, MessageSquare, Edit, CheckCircle2, AlertCircle, Loader2, UserIcon } from "lucide-react"
import type { Chamado, Comentario, Usuario } from "../../types"
import { formatarData, obterCorStatus, obterCorPrioridade } from "../../utils/helpers"
import { useAuth } from "../../contexts/AuthContext"
import { useTickets } from "../../contexts/TicketContext"
import { buscarUsuarioPorId } from "../../services/usuarioService"

interface TicketDetailProps {
  ticket: Chamado
}

const Comment: React.FC<{ comment: Comentario }> = ({ comment }) => {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
            {comment.nomeUsuario.charAt(0)}
          </div>
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-900">{comment.nomeUsuario}</span>
              <span className="text-sm text-gray-500 ml-2 capitalize">({comment.cargoUsuario})</span>
            </div>
            <span className="text-sm text-gray-500">{formatarData(comment.dataCriacao)}</span>
          </div>
          <div className="mt-1 text-sm text-gray-700">
            <p>{comment.conteudo}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const TicketDetail: React.FC<TicketDetailProps> = ({ ticket }) => {
  const { currentUser } = useAuth()
  const { updateTicketStatus, assignTicket, addTicketComment } = useTickets()

  const [newComment, setNewComment] = useState("")
  const [isCommenting, setIsCommenting] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [isAssigning, setIsAssigning] = useState(false)
  const [assignedUser, setAssignedUser] = useState<Usuario | null>(null)
  const [createdByUser, setCreatedByUser] = useState<Usuario | null>(null)

  // Buscar informações dos usuários
  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Buscar usuário atribuído
        if (ticket.atribuidoPara) {
          const assignedUserData = await buscarUsuarioPorId(ticket.atribuidoPara)
          setAssignedUser(assignedUserData)
        }

        // Buscar usuário criador
        const createdByUserData = await buscarUsuarioPorId(ticket.criadoPor)
        setCreatedByUser(createdByUserData)
      } catch (error) {
        console.error("Erro ao buscar informações dos usuários:", error)
      }
    }

    fetchUsers()
  }, [ticket.atribuidoPara, ticket.criadoPor])

  const handleStatusChange = async (newStatus: Chamado["status"]) => {
    if (!currentUser || isUpdatingStatus || ticket.status === newStatus) return

    try {
      setIsUpdatingStatus(true)
      await updateTicketStatus(ticket.id, newStatus)
    } catch (error) {
      console.error("Falha ao atualizar status:", error)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleAssignToMe = async () => {
    if (!currentUser || isAssigning || ticket.atribuidoPara === currentUser.id) return

    try {
      setIsAssigning(true)
      await assignTicket(ticket.id, currentUser.id)
    } catch (error) {
      console.error("Falha ao atribuir chamado:", error)
    } finally {
      setIsAssigning(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !newComment.trim() || isCommenting) return

    try {
      setIsCommenting(true)
      await addTicketComment(ticket.id, {
        chamadoId: ticket.id,
        usuarioId: currentUser.id,
        nomeUsuario: currentUser.nome,
        cargoUsuario: currentUser.cargo,
        conteudo: newComment.trim(),
      })
      setNewComment("")
    } catch (error) {
      console.error("Falha ao adicionar comentário:", error)
    } finally {
      setIsCommenting(false)
    }
  }

  const canUpdateStatus = currentUser?.cargo === "admin" || currentUser?.cargo === "suporte"

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200">
        <div className="flex flex-wrap items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">{ticket.titulo}</h2>
          <div className="flex items-center mt-2 sm:mt-0">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${obterCorStatus(ticket.status)}`}>
              {ticket.status.replace("-", " ")}
            </span>
            <span
              className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${obterCorPrioridade(ticket.prioridade)}`}
            >
              {ticket.prioridade}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 p-5">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Descrição</h3>
            <p className="text-gray-700 whitespace-pre-line">{ticket.descricao}</p>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Comentários</h3>
              <span className="text-sm text-gray-500">{ticket.comentarios.length} comentários</span>
            </div>

            <div className="space-y-4 mb-4">
              {ticket.comentarios.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhum comentário ainda.</p>
              ) : (
                ticket.comentarios.map((comment) => <Comment key={comment.id} comment={comment} />)
              )}
            </div>

            {currentUser && (
              <form onSubmit={handleSubmitComment}>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {currentUser.avatar ? (
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={currentUser.avatar || "/placeholder.svg"}
                        alt={currentUser.nome}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        {currentUser.nome.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <textarea
                      rows={3}
                      className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
                      placeholder="Adicionar um comentário..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        type="submit"
                        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                          isCommenting || !newComment.trim() ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isCommenting || !newComment.trim()}
                      >
                        {isCommenting ? (
                          <>
                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Comentar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 bg-gray-50 p-5 border-l border-gray-200">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Informações do Chamado</h3>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Criado por</p>
                <div className="mt-1 flex items-center">
                  {createdByUser?.avatar ? (
                    <img
                      className="h-6 w-6 rounded-full object-cover"
                      src={createdByUser.avatar || "/placeholder.svg"}
                      alt={createdByUser.nome}
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                      {createdByUser?.nome.charAt(0) || "?"}
                    </div>
                  )}
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    {createdByUser?.nome || "Usuário Desconhecido"}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">Criado em</p>
                <p className="mt-1 text-sm text-gray-900 flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-1" />
                  {formatarData(ticket.dataCriacao)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Última atualização</p>
                <p className="mt-1 text-sm text-gray-900 flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-1" />
                  {formatarData(ticket.dataAtualizacao)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Atribuído para</p>
                {ticket.atribuidoPara ? (
                  <div className="mt-1 flex items-center">
                    {assignedUser?.avatar ? (
                      <img
                        className="h-6 w-6 rounded-full object-cover"
                        src={assignedUser.avatar || "/placeholder.svg"}
                        alt={assignedUser.nome}
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                        {assignedUser?.nome.charAt(0) || "?"}
                      </div>
                    )}
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {assignedUser?.nome || "Usuário Desconhecido"}
                    </span>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">Não atribuído</p>
                )}
              </div>

              <div>
                <p className="text-xs text-gray-500">Categoria</p>
                <p className="mt-1 text-sm text-gray-900 capitalize">{ticket.categoria}</p>
              </div>
            </div>
          </div>

          {currentUser && (currentUser.cargo === "admin" || currentUser.cargo === "suporte") && (
            <div className="space-y-4">
              {!ticket.atribuidoPara && (
                <button
                  type="button"
                  className={`w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isAssigning ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={handleAssignToMe}
                  disabled={isAssigning}
                >
                  {isAssigning ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Atribuindo...
                    </>
                  ) : (
                    <>
                      <UserIcon className="mr-2 h-4 w-4" />
                      Atribuir para mim
                    </>
                  )}
                </button>
              )}

              {canUpdateStatus && ticket.status !== "fechado" && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Atualizar Status</h4>
                  <div className="space-y-2">
                    {ticket.status !== "em-andamento" && (
                      <button
                        type="button"
                        className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${
                          isUpdatingStatus ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => handleStatusChange("em-andamento")}
                        disabled={isUpdatingStatus}
                      >
                        {isUpdatingStatus ? (
                          <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        ) : (
                          <Loader2 className="mr-2 h-4 w-4" />
                        )}
                        Marcar como Em Andamento
                      </button>
                    )}

                    {ticket.status !== "resolvido" && (
                      <button
                        type="button"
                        className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                          isUpdatingStatus ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => handleStatusChange("resolvido")}
                        disabled={isUpdatingStatus}
                      >
                        {isUpdatingStatus ? (
                          <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        ) : (
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                        )}
                        Marcar como Resolvido
                      </button>
                    )}

                    {ticket.status !== "fechado" && (
                      <button
                        type="button"
                        className={`w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                          isUpdatingStatus ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => handleStatusChange("fechado")}
                        disabled={isUpdatingStatus}
                      >
                        {isUpdatingStatus ? (
                          <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        ) : (
                          <Edit className="mr-2 h-4 w-4" />
                        )}
                        Fechar Chamado
                      </button>
                    )}
                  </div>
                </div>
              )}

              {ticket.status === "fechado" && (
                <button
                  type="button"
                  className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isUpdatingStatus ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => handleStatusChange("aberto")}
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? (
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  ) : (
                    <AlertCircle className="mr-2 h-4 w-4" />
                  )}
                  Reabrir Chamado
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TicketDetail
