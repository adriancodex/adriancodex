import { Pool } from "pg"

// Configuração da conexão com o banco de dados
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "sistema_chamados",
  port: Number.parseInt(process.env.DB_PORT || "5432"),
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  max: 20, // Máximo de conexões no pool
  idleTimeoutMillis: 30000, // Tempo máximo que uma conexão pode ficar inativa
  connectionTimeoutMillis: 2000, // Tempo máximo para estabelecer uma conexão
})

// Função para executar queries com proteção contra SQL Injection
export async function executeQuery<T>(query: string, params: any[] = []): Promise<T> {
  try {
    // Sanitizar parâmetros para evitar SQL Injection
    const sanitizedParams = params.map((param) => {
      if (typeof param === "string") {
        // Remover caracteres potencialmente perigosos
        return param.replace(/['";\\]/g, "")
      }
      return param
    })

    const result = await pool.query(query, sanitizedParams)
    return result.rows as T
  } catch (error) {
    console.error("Erro ao executar query:", error)
    throw error
  }
}

// Função para testar a conexão
export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect()
    client.release()
    console.log("Conexão com o banco de dados estabelecida com sucesso!")
    return true
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error)
    return false
  }
}

// Função para fechar o pool de conexões (útil para testes e encerramento da aplicação)
export async function closePool(): Promise<void> {
  await pool.end()
}

export default pool
