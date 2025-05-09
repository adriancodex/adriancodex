-- Criação das tabelas para o sistema de chamados (PostgreSQL)

-- Tipos enumerados
CREATE TYPE cargo_usuario AS ENUM ('admin', 'suporte', 'usuario');
CREATE TYPE status_chamado AS ENUM ('aberto', 'em-andamento', 'resolvido', 'fechado');
CREATE TYPE prioridade_chamado AS ENUM ('baixa', 'media', 'alta', 'critica');
CREATE TYPE categoria_chamado AS ENUM ('hardware', 'software', 'rede', 'acesso', 'outro');

-- Tabela de usuários
CREATE TABLE usuarios (
    id VARCHAR(36) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    cargo cargo_usuario NOT NULL DEFAULT 'usuario',
    avatar VARCHAR(255),
    departamento VARCHAR(100),
    telefone VARCHAR(20),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de chamados
CREATE TABLE chamados (
    id VARCHAR(36) PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT NOT NULL,
    status status_chamado NOT NULL DEFAULT 'aberto',
    prioridade prioridade_chamado NOT NULL DEFAULT 'media',
    categoria categoria_chamado NOT NULL,
    criado_por VARCHAR(36) NOT NULL,
    atribuido_para VARCHAR(36),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (criado_por) REFERENCES usuarios(id),
    FOREIGN KEY (atribuido_para) REFERENCES usuarios(id)
);

-- Tabela de comentários
CREATE TABLE comentarios (
    id VARCHAR(36) PRIMARY KEY,
    chamado_id VARCHAR(36) NOT NULL,
    usuario_id VARCHAR(36) NOT NULL,
    conteudo TEXT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chamado_id) REFERENCES chamados(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabela de configurações do usuário
CREATE TABLE configuracoes_usuario (
    usuario_id VARCHAR(36) PRIMARY KEY,
    tema VARCHAR(20) DEFAULT 'claro',
    tamanho_fonte VARCHAR(20) DEFAULT 'medio',
    idioma VARCHAR(10) DEFAULT 'pt-BR',
    notificacao_email BOOLEAN DEFAULT TRUE,
    notificacao_push BOOLEAN DEFAULT TRUE,
    notificacao_atualizacoes BOOLEAN DEFAULT TRUE,
    notificacao_comentarios BOOLEAN DEFAULT TRUE,
    notificacao_atribuicoes BOOLEAN DEFAULT TRUE,
    notificacao_anuncios BOOLEAN DEFAULT FALSE,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de logs de atividades
CREATE TABLE logs_atividade (
    id VARCHAR(36) PRIMARY KEY,
    usuario_id VARCHAR(36) NOT NULL,
    chamado_id VARCHAR(36),
    tipo_atividade VARCHAR(50) NOT NULL,
    descricao TEXT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (chamado_id) REFERENCES chamados(id) ON DELETE SET NULL
);

-- Índices para melhorar a performance
CREATE INDEX idx_chamados_criado_por ON chamados(criado_por);
CREATE INDEX idx_chamados_atribuido_para ON chamados(atribuido_para);
CREATE INDEX idx_chamados_status ON chamados(status);
CREATE INDEX idx_comentarios_chamado_id ON comentarios(chamado_id);
CREATE INDEX idx_logs_chamado_id ON logs_atividade(chamado_id);

-- Função para atualizar o timestamp de atualização
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.data_atualizacao = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar automaticamente os timestamps
CREATE TRIGGER update_usuarios_timestamp
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_chamados_timestamp
BEFORE UPDATE ON chamados
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_configuracoes_usuario_timestamp
BEFORE UPDATE ON configuracoes_usuario
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
