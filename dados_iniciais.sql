-- Inserir usuários iniciais (PostgreSQL)
-- Senha para Adrian Silva alterada para "aDRIAN6807#"
INSERT INTO usuarios (id, nome, email, senha, cargo, avatar, data_criacao, data_atualizacao) VALUES
('user-1', 'Adrian Silva', 'firesolucoestecnologicas@gmail.com', '$2b$10$Xt5TqvX9jMQpFBc.vH.YEeOuI0G0NbfJzYZG4XbmzKSNGZ7MvFKDi', 'admin', 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user-2', 'Maria Santos', 'maria@exemplo.com', '$2b$10$XdNzrKMB9e.hkJ8h.VOeJeZHs1.l9/QYLPfJx.qkgzC0UZhvXkGHy', 'suporte', 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=100', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user-3', 'Pedro Oliveira', 'pedro@exemplo.com', '$2b$10$XdNzrKMB9e.hkJ8h.VOeJeZHs1.l9/QYLPfJx.qkgzC0UZhvXkGHy', 'usuario', 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Inserir configurações de usuário
INSERT INTO configuracoes_usuario (usuario_id, tema, tamanho_fonte, idioma, data_atualizacao) VALUES
('user-1', 'claro', 'medio', 'pt-BR', CURRENT_TIMESTAMP),
('user-2', 'claro', 'medio', 'pt-BR', CURRENT_TIMESTAMP),
('user-3', 'claro', 'medio', 'pt-BR', CURRENT_TIMESTAMP);

-- Inserir chamados iniciais
INSERT INTO chamados (id, titulo, descricao, status, prioridade, categoria, criado_por, atribuido_para, data_criacao, data_atualizacao) VALUES
('ticket-1', 'Computador não liga', 'Meu computador não liga quando pressiono o botão de energia. Já verifiquei que está conectado corretamente.', 'aberto', 'alta', 'hardware', 'user-3', 'user-2', '2023-05-15 10:30:00', '2023-05-15 10:30:00'),
('ticket-2', 'Sem acesso à pasta compartilhada', 'Não consigo acessar a pasta compartilhada do departamento de marketing. Funcionava ontem, mas hoje recebo erro de permissão.', 'em-andamento', 'media', 'acesso', 'user-3', 'user-1', '2023-05-14 14:45:00', '2023-05-15 09:20:00'),
('ticket-3', 'Email não sincroniza no celular', 'Meu email corporativo não está sincronizando no celular da empresa. O email no computador funciona normalmente.', 'aberto', 'baixa', 'software', 'user-3', NULL, '2023-05-15 08:30:00', '2023-05-15 08:30:00'),
('ticket-4', 'Solicitação de instalação de software', 'Preciso do Adobe Photoshop instalado no meu computador para o novo projeto de marketing.', 'fechado', 'media', 'software', 'user-3', 'user-2', '2023-05-10 11:15:00', '2023-05-12 16:45:00'),
('ticket-5', 'Problemas de conectividade de rede', 'A conexão com a internet está caindo constantemente na sala de reuniões.', 'resolvido', 'alta', 'rede', 'user-3', 'user-1', '2023-05-13 09:10:00', '2023-05-14 13:25:00');

-- Inserir comentários
INSERT INTO comentarios (id, chamado_id, usuario_id, conteudo, data_criacao) VALUES
('comment-1', 'ticket-1', 'user-3', 'Já tentei desligar e ligar novamente, mas ainda não funciona.', '2023-05-15 11:30:00'),
('comment-2', 'ticket-1', 'user-2', 'Estarei indo até sua mesa em breve para verificar o hardware.', '2023-05-15 12:15:00'),
('comment-3', 'ticket-2', 'user-1', 'Estamos investigando o problema. Parece haver um problema com as configurações de permissão.', '2023-05-15 09:20:00'),
('comment-4', 'ticket-4', 'user-2', 'Software instalado e licença ativada.', '2023-05-12 16:45:00'),
('comment-5', 'ticket-5', 'user-1', 'Roteador foi reiniciado e firmware atualizado. Por favor, nos avise se o problema persistir.', '2023-05-14 13:25:00');

-- Inserir logs de atividade
INSERT INTO logs_atividade (id, usuario_id, chamado_id, tipo_atividade, descricao, data_criacao) VALUES
('log-1', 'user-3', 'ticket-1', 'criacao', 'Chamado criado: Computador não liga', '2023-05-15 10:30:00'),
('log-2', 'user-3', 'ticket-2', 'criacao', 'Chamado criado: Sem acesso à pasta compartilhada', '2023-05-14 14:45:00'),
('log-3', 'user-1', 'ticket-2', 'atribuicao', 'Chamado atribuído para usuário: user-1', '2023-05-14 15:00:00'),
('log-4', 'user-1', 'ticket-2', 'atualizacao_status', 'Status atualizado para: em-andamento', '2023-05-14 15:05:00'),
('log-5', 'user-2', 'ticket-1', 'comentario', 'Comentário adicionado: Estarei indo até sua mesa em breve para verificar o hardware.', '2023-05-15 12:15:00');
