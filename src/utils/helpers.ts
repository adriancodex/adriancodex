import type { PrioridadeChamado, StatusChamado, CategoriaChamado, Chamado } from "../types"

// Gerar um ID único com prefixo
export const gerarId = (prefixo: string): string => {
  return `${prefixo}-${Date.now()}-${Math.floor(Math.random() * 10000)}`
}

// Formatar uma data
export const formatarData = (dataString: string): string => {
  const data = new Date(dataString)
  return new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(data)
}

// Obter tempo relativo (ex: "2 horas atrás")
export const obterTempoRelativo = (dataString: string): string => {
  const data = new Date(dataString)
  const agora = new Date()
  const segundos = Math.floor((agora.getTime() - data.getTime()) / 1000)

  let intervalo = segundos / 31536000
  if (intervalo > 1) return `${Math.floor(intervalo)} anos atrás`

  intervalo = segundos / 2592000
  if (intervalo > 1) return `${Math.floor(intervalo)} meses atrás`

  intervalo = segundos / 86400
  if (intervalo > 1) return `${Math.floor(intervalo)} dias atrás`

  intervalo = segundos / 3600
  if (intervalo > 1) return `${Math.floor(intervalo)} horas atrás`

  intervalo = segundos / 60
  if (intervalo > 1) return `${Math.floor(intervalo)} minutos atrás`

  return "agora mesmo"
}

// Obter classe de cor para o status do chamado
export const obterCorStatus = (status: StatusChamado): string => {
  switch (status) {
    case "aberto":
      return "bg-blue-100 text-blue-800"
    case "em-andamento":
      return "bg-amber-100 text-amber-800"
    case "resolvido":
      return "bg-green-100 text-green-800"
    case "fechado":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// Obter classe de cor para a prioridade do chamado
export const obterCorPrioridade = (prioridade: PrioridadeChamado): string => {
  switch (prioridade) {
    case "baixa":
      return "bg-green-100 text-green-800"
    case "media":
      return "bg-blue-100 text-blue-800"
    case "alta":
      return "bg-amber-100 text-amber-800"
    case "critica":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// Obter ícone para a categoria do chamado
export const obterIconeCategoria = (categoria: CategoriaChamado): string => {
  switch (categoria) {
    case "hardware":
      return "Cpu"
    case "software":
      return "AppWindow"
    case "rede":
      return "Wifi"
    case "acesso":
      return "Key"
    case "outro":
      return "HelpCircle"
    default:
      return "Ticket"
  }
}

// Pesquisar chamados por consulta
export const pesquisarChamados = (chamados: Chamado[], consulta: string): Chamado[] => {
  if (!consulta.trim()) return chamados

  const consultaMinuscula = consulta.toLowerCase()
  return chamados.filter(
    (chamado) =>
      chamado.titulo.toLowerCase().includes(consultaMinuscula) ||
      chamado.descricao.toLowerCase().includes(consultaMinuscula) ||
      chamado.categoria.toLowerCase().includes(consultaMinuscula) ||
      chamado.status.toLowerCase().includes(consultaMinuscula) ||
      chamado.prioridade.toLowerCase().includes(consultaMinuscula),
  )
}
