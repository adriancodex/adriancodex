export type StatusChamado = "aberto" | "em-andamento" | "resolvido" | "fechado"

export type PrioridadeChamado = "baixa" | "media" | "alta" | "critica"

export type CategoriaChamado = "hardware" | "software" | "rede" | "acesso" | "outro"

export interface Usuario {
  id: string
  nome: string
  email: string
  cargo: "admin" | "suporte" | "usuario"
  avatar?: string
  departamento?: string
  telefone?: string
}

export interface Comentario {
  id: string
  chamadoId: string
  usuarioId: string
  nomeUsuario: string
  cargoUsuario: string
  conteudo: string
  dataCriacao: string
}

export interface Chamado {
  id: string
  titulo: string
  descricao: string
  status: StatusChamado
  prioridade: PrioridadeChamado
  categoria: CategoriaChamado
  dataCriacao: string
  dataAtualizacao: string
  criadoPor: string
  atribuidoPara?: string
  comentarios: Comentario[]
}

export const LABELS_STATUS = {
  aberto: "Aberto",
  "em-andamento": "Em Andamento",
  resolvido: "Resolvido",
  fechado: "Fechado",
}

export const LABELS_PRIORIDADE = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
  critica: "Crítica",
}

export const LABELS_CATEGORIA = {
  hardware: "Hardware",
  software: "Software",
  rede: "Rede",
  acesso: "Acesso",
  outro: "Outros",
}
