import { executeQuery } from "../config/database"
import type { Chamado, Comentario } from "../types"
import { gerarId } from "../utils/helpers"

// Buscar chamado por ID com comentários
export async function buscarChamadoPorId(id: string): Promise<Chamado | null> {
  if (!id || typeof id !== "string") {
    throw new Error("ID de chamado inválido")
  }

  const chamados = await executeQuery<Chamado[]>(
    `SELECT id, titulo, descricao, status, prioridade, categoria, 
     criado_por as criadoPor, atribuido_para as atribuidoPara,
     data_criacao as dataCriacao, data_atualizacao as dataAtualizacao
     FROM chamados WHERE id = $1`,
    [id],
  )

  if (chamados.length === 0) return null

  const chamado = chamados[0]

  // Buscar comentários do chamado
  const comentarios = await executeQuery<Comentario[]>(
    `SELECT c.id, c.chamado_id as chamadoId, c.usuario_id as usuarioId, 
     u.nome as nomeUsuario, u.cargo as cargoUsuario, c.conteudo,
     c.data_criacao as dataCriacao
     FROM comentarios c
     JOIN usuarios u ON c.usuario_id = u.id
     WHERE c.chamado_id = $1
     ORDER BY c.data_criacao`,
    [id],
  )

  return {
    ...chamado,
    comentarios,
  }
}

// Listar todos os chamados
export async function listarChamados(): Promise<Chamado[]> {
  const chamados = await executeQuery<Chamado[]>(
    `SELECT id, titulo, descricao, status, prioridade, categoria, 
     criado_por as criadoPor, atribuido_para as atribuidoPara,
     data_criacao as dataCriacao, data_atualizacao as dataAtualizacao
     FROM chamados
     ORDER BY data_criacao DESC`,
  )

  // Buscar comentários para cada chamado
  for (const chamado of chamados) {
    const comentarios = await executeQuery<Comentario[]>(
      `SELECT c.id, c.chamado_id as chamadoId, c.usuario_id as usuarioId, 
       u.nome as nomeUsuario, u.cargo as cargoUsuario, c.conteudo,
       c.data_criacao as dataCriacao
       FROM comentarios c
       JOIN usuarios u ON c.usuario_id = u.id
       WHERE c.chamado_id = $1
       ORDER BY c.data_criacao`,
      [chamado.id],
    )

    chamado.comentarios = comentarios
  }

  return chamados
}

// Criar novo chamado
export async function criarChamado(dados: {
  titulo: string
  descricao: string
  status: string
  prioridade: string
  categoria: string
  criadoPor: string
  atribuidoPara?: string
}): Promise<Chamado> {
  // Validar dados
  if (!dados.titulo || !dados.descricao || !dados.status || !dados.prioridade || !dados.categoria || !dados.criadoPor) {
    throw new Error("Dados incompletos para criar chamado")
  }

  const id = gerarId("ticket")
  const agora = new Date().toISOString()

  await executeQuery(
    `INSERT INTO chamados (id, titulo, descricao, status, prioridade, categoria, 
     criado_por, atribuido_para, data_criacao, data_atualizacao)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      id,
      dados.titulo,
      dados.descricao,
      dados.status,
      dados.prioridade,
      dados.categoria,
      dados.criadoPor,
      dados.atribuidoPara || null,
      agora,
      agora,
    ],
  )

  // Registrar atividade
  await executeQuery(
    `INSERT INTO logs_atividade (id, usuario_id, chamado_id, tipo_atividade, descricao)
     VALUES ($1, $2, $3, $4, $5)`,
    [gerarId("log"), dados.criadoPor, id, "criacao", `Chamado criado: ${dados.titulo}`],
  )

  return {
    id,
    titulo: dados.titulo,
    descricao: dados.descricao,
    status: dados.status as any,
    prioridade: dados.prioridade as any,
    categoria: dados.categoria as any,
    criadoPor: dados.criadoPor,
    atribuidoPara: dados.atribuidoPara,
    dataCriacao: agora,
    dataAtualizacao: agora,
    comentarios: [],
  }
}

// Atualizar status do chamado
export async function atualizarStatusChamado(id: string, status: string, usuarioId: string): Promise<Chamado | null> {
  if (!id || !status || !usuarioId) {
    throw new Error("Dados incompletos para atualizar status do chamado")
  }

  const chamado = await buscarChamadoPorId(id)
  if (!chamado) return null

  await executeQuery(`UPDATE chamados SET status = $1, data_atualizacao = CURRENT_TIMESTAMP WHERE id = $2`, [
    status,
    id,
  ])

  // Registrar atividade
  await executeQuery(
    `INSERT INTO logs_atividade (id, usuario_id, chamado_id, tipo_atividade, descricao)
     VALUES ($1, $2, $3, $4, $5)`,
    [gerarId("log"), usuarioId, id, "atualizacao_status", `Status atualizado para: ${status}`],
  )

  return {
    ...chamado,
    status: status as any,
    dataAtualizacao: new Date().toISOString(),
  }
}

// Atribuir chamado
export async function atribuirChamado(id: string, usuarioId: string, atribuidoPor: string): Promise<Chamado | null> {
  if (!id || !usuarioId || !atribuidoPor) {
    throw new Error("Dados incompletos para atribuir chamado")
  }

  const chamado = await buscarChamadoPorId(id)
  if (!chamado) return null

  await executeQuery(`UPDATE chamados SET atribuido_para = $1, data_atualizacao = CURRENT_TIMESTAMP WHERE id = $2`, [
    usuarioId,
    id,
  ])

  // Registrar atividade
  await executeQuery(
    `INSERT INTO logs_atividade (id, usuario_id, chamado_id, tipo_atividade, descricao)
     VALUES ($1, $2, $3, $4, $5)`,
    [gerarId("log"), atribuidoPor, id, "atribuicao", `Chamado atribuído para usuário: ${usuarioId}`],
  )

  return {
    ...chamado,
    atribuidoPara: usuarioId,
    dataAtualizacao: new Date().toISOString(),
  }
}

// Adicionar comentário
export async function adicionarComentario(dados: {
  chamadoId: string
  usuarioId: string
  conteudo: string
}): Promise<Comentario> {
  if (!dados.chamadoId || !dados.usuarioId || !dados.conteudo) {
    throw new Error("Dados incompletos para adicionar comentário")
  }

  const id = gerarId("comment")
  const agora = new Date().toISOString()

  // Buscar informações do usuário
  const usuarios = await executeQuery<{ nome: string; cargo: string }[]>(
    "SELECT nome, cargo FROM usuarios WHERE id = $1",
    [dados.usuarioId],
  )

  if (usuarios.length === 0) {
    throw new Error("Usuário não encontrado")
  }

  const { nome: nomeUsuario, cargo: cargoUsuario } = usuarios[0]

  await executeQuery(
    `INSERT INTO comentarios (id, chamado_id, usuario_id, conteudo, data_criacao)
     VALUES ($1, $2, $3, $4, $5)`,
    [id, dados.chamadoId, dados.usuarioId, dados.conteudo, agora],
  )

  // Atualizar data de atualização do chamado
  await executeQuery(`UPDATE chamados SET data_atualizacao = CURRENT_TIMESTAMP WHERE id = $1`, [dados.chamadoId])

  // Registrar atividade
  await executeQuery(
    `INSERT INTO logs_atividade (id, usuario_id, chamado_id, tipo_atividade, descricao)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      gerarId("log"),
      dados.usuarioId,
      dados.chamadoId,
      "comentario",
      `Comentário adicionado: ${dados.conteudo.substring(0, 50)}${dados.conteudo.length > 50 ? "..." : ""}`,
    ],
  )

  return {
    id,
    chamadoId: dados.chamadoId,
    usuarioId: dados.usuarioId,
    nomeUsuario,
    cargoUsuario,
    conteudo: dados.conteudo,
    dataCriacao: agora,
  }
}

// Buscar chamados por usuário (criados por)
export async function buscarChamadosPorCriador(usuarioId: string): Promise<Chamado[]> {
  if (!usuarioId) {
    throw new Error("ID de usuário inválido")
  }

  const chamados = await executeQuery<Chamado[]>(
    `SELECT id, titulo, descricao, status, prioridade, categoria, 
     criado_por as criadoPor, atribuido_para as atribuidoPara,
     data_criacao as dataCriacao, data_atualizacao as dataAtualizacao
     FROM chamados
     WHERE criado_por = $1
     ORDER BY data_criacao DESC`,
    [usuarioId],
  )

  // Buscar comentários para cada chamado
  for (const chamado of chamados) {
    const comentarios = await executeQuery<Comentario[]>(
      `SELECT c.id, c.chamado_id as chamadoId, c.usuario_id as usuarioId, 
       u.nome as nomeUsuario, u.cargo as cargoUsuario, c.conteudo,
       c.data_criacao as dataCriacao
       FROM comentarios c
       JOIN usuarios u ON c.usuario_id = u.id
       WHERE c.chamado_id = $1
       ORDER BY c.data_criacao`,
      [chamado.id],
    )

    chamado.comentarios = comentarios
  }

  return chamados
}

// Buscar chamados atribuídos a um usuário
export async function buscarChamadosAtribuidos(usuarioId: string): Promise<Chamado[]> {
  if (!usuarioId) {
    throw new Error("ID de usuário inválido")
  }

  const chamados = await executeQuery<Chamado[]>(
    `SELECT id, titulo, descricao, status, prioridade, categoria, 
     criado_por as criadoPor, atribuido_para as atribuidoPara,
     data_criacao as dataCriacao, data_atualizacao as dataAtualizacao
     FROM chamados
     WHERE atribuido_para = $1
     ORDER BY data_criacao DESC`,
    [usuarioId],
  )

  // Buscar comentários para cada chamado
  for (const chamado of chamados) {
    const comentarios = await executeQuery<Comentario[]>(
      `SELECT c.id, c.chamado_id as chamadoId, c.usuario_id as usuarioId, 
       u.nome as nomeUsuario, u.cargo as cargoUsuario, c.conteudo,
       c.data_criacao as dataCriacao
       FROM comentarios c
       JOIN usuarios u ON c.usuario_id = u.id
       WHERE c.chamado_id = $1
       ORDER BY c.data_criacao`,
      [chamado.id],
    )

    chamado.comentarios = comentarios
  }

  return chamados
}
