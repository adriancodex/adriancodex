import { executeQuery } from "../config/database"
import type { Usuario } from "../types"
import { gerarId } from "../utils/helpers"
import bcrypt from "bcrypt"

// Buscar usuário por ID
export async function buscarUsuarioPorId(id: string): Promise<Usuario | null> {
  if (!id || typeof id !== "string") {
    throw new Error("ID de usuário inválido")
  }

  const usuarios = await executeQuery<Usuario[]>(
    "SELECT id, nome, email, cargo, avatar, departamento, telefone FROM usuarios WHERE id = $1",
    [id],
  )

  return usuarios.length > 0 ? usuarios[0] : null
}

// Buscar usuário por email
export async function buscarUsuarioPorEmail(email: string): Promise<Usuario | null> {
  if (!email || typeof email !== "string" || !email.includes("@")) {
    throw new Error("Email inválido")
  }

  const usuarios = await executeQuery<Usuario[]>(
    "SELECT id, nome, email, cargo, avatar, departamento, telefone FROM usuarios WHERE email = $1",
    [email],
  )

  return usuarios.length > 0 ? usuarios[0] : null
}

// Verificar credenciais de login
export async function verificarCredenciais(email: string, senha: string): Promise<Usuario | null> {
  if (!email || !senha) {
    return null
  }

  // Limitar tentativas de login (implementação básica)
  const loginAttempts: Record<string, { count: number; lastAttempt: number }> = {}

  // Verificar se o email está bloqueado por muitas tentativas
  const now = Date.now()
  if (loginAttempts[email] && loginAttempts[email].count >= 5) {
    const timeSinceLastAttempt = now - loginAttempts[email].lastAttempt
    if (timeSinceLastAttempt < 15 * 60 * 1000) {
      // 15 minutos de bloqueio
      throw new Error("Muitas tentativas de login. Tente novamente mais tarde.")
    } else {
      // Reset após 15 minutos
      delete loginAttempts[email]
    }
  }

  const usuarios = await executeQuery<(Usuario & { senha: string })[]>(
    "SELECT id, nome, email, cargo, avatar, senha FROM usuarios WHERE email = $1",
    [email],
  )

  if (usuarios.length === 0) {
    // Registrar tentativa de login
    if (!loginAttempts[email]) {
      loginAttempts[email] = { count: 1, lastAttempt: now }
    } else {
      loginAttempts[email].count++
      loginAttempts[email].lastAttempt = now
    }
    return null
  }

  const usuario = usuarios[0]
  const senhaCorreta = await bcrypt.compare(senha, usuario.senha)

  if (!senhaCorreta) {
    // Registrar tentativa de login
    if (!loginAttempts[email]) {
      loginAttempts[email] = { count: 1, lastAttempt: now }
    } else {
      loginAttempts[email].count++
      loginAttempts[email].lastAttempt = now
    }
    return null
  }

  // Limpar tentativas de login após sucesso
  delete loginAttempts[email]

  // Não retornar a senha
  const { senha: _, ...usuarioSemSenha } = usuario
  return usuarioSemSenha
}

// Criar novo usuário
export async function criarUsuario(dados: {
  nome: string
  email: string
  senha: string
  cargo: "admin" | "suporte" | "usuario"
  avatar?: string
  departamento?: string
  telefone?: string
}): Promise<Usuario> {
  // Validar dados
  if (!dados.nome || !dados.email || !dados.senha || !dados.cargo) {
    throw new Error("Dados incompletos para criar usuário")
  }

  // Verificar se o email já existe
  const usuarioExistente = await buscarUsuarioPorEmail(dados.email)
  if (usuarioExistente) {
    throw new Error("Email já está em uso")
  }

  // Validar força da senha
  if (dados.senha.length < 8) {
    throw new Error("A senha deve ter pelo menos 8 caracteres")
  }

  if (!/[A-Z]/.test(dados.senha)) {
    throw new Error("A senha deve conter pelo menos uma letra maiúscula")
  }

  if (!/[0-9]/.test(dados.senha)) {
    throw new Error("A senha deve conter pelo menos um número")
  }

  if (!/[^A-Za-z0-9]/.test(dados.senha)) {
    throw new Error("A senha deve conter pelo menos um caractere especial")
  }

  const id = gerarId("user")
  const senhaCriptografada = await bcrypt.hash(dados.senha, 12) // Aumentado para 12 rounds

  await executeQuery(
    `INSERT INTO usuarios (id, nome, email, senha, cargo, avatar, departamento, telefone) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      id,
      dados.nome,
      dados.email,
      senhaCriptografada,
      dados.cargo,
      dados.avatar || null,
      dados.departamento || null,
      dados.telefone || null,
    ],
  )

  return {
    id,
    nome: dados.nome,
    email: dados.email,
    cargo: dados.cargo,
    avatar: dados.avatar,
    departamento: dados.departamento,
    telefone: dados.telefone,
  }
}

// Atualizar usuário
export async function atualizarUsuario(id: string, dados: Partial<Omit<Usuario, "id">>): Promise<Usuario | null> {
  if (!id) {
    throw new Error("ID de usuário inválido")
  }

  const usuario = await buscarUsuarioPorId(id)
  if (!usuario) return null

  const campos: string[] = []
  const valores: any[] = []

  Object.entries(dados).forEach(([chave, valor], index) => {
    if (valor !== undefined) {
      campos.push(`${chave} = $${index + 1}`)
      valores.push(valor)
    }
  })

  if (campos.length === 0) return usuario

  valores.push(id)

  await executeQuery(
    `UPDATE usuarios SET ${campos.join(", ")}, data_atualizacao = CURRENT_TIMESTAMP WHERE id = $${valores.length}`,
    valores,
  )

  return {
    ...usuario,
    ...dados,
  }
}

// Alterar senha
export async function alterarSenha(id: string, senhaAtual: string, novaSenha: string): Promise<boolean> {
  if (!id || !senhaAtual || !novaSenha) {
    throw new Error("Dados incompletos para alterar senha")
  }

  // Validar força da nova senha
  if (novaSenha.length < 8) {
    throw new Error("A nova senha deve ter pelo menos 8 caracteres")
  }

  if (!/[A-Z]/.test(novaSenha)) {
    throw new Error("A nova senha deve conter pelo menos uma letra maiúscula")
  }

  if (!/[0-9]/.test(novaSenha)) {
    throw new Error("A nova senha deve conter pelo menos um número")
  }

  if (!/[^A-Za-z0-9]/.test(novaSenha)) {
    throw new Error("A nova senha deve conter pelo menos um caractere especial")
  }

  const usuarios = await executeQuery<(Usuario & { senha: string })[]>("SELECT senha FROM usuarios WHERE id = $1", [id])

  if (usuarios.length === 0) return false

  const senhaCorreta = await bcrypt.compare(senhaAtual, usuarios[0].senha)
  if (!senhaCorreta) return false

  const senhaCriptografada = await bcrypt.hash(novaSenha, 12) // Aumentado para 12 rounds

  await executeQuery("UPDATE usuarios SET senha = $1, data_atualizacao = CURRENT_TIMESTAMP WHERE id = $2", [
    senhaCriptografada,
    id,
  ])

  return true
}

// Listar todos os usuários
export async function listarUsuarios(): Promise<Usuario[]> {
  return executeQuery<Usuario[]>(
    "SELECT id, nome, email, cargo, avatar, departamento, telefone FROM usuarios ORDER BY nome",
  )
}
