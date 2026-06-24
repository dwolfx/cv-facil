-- =========================================================================
-- HISTÓRICO DE MIGRAÇÕES / ATUALIZAÇÕES DO SUPABASE
-- Execute os blocos abaixo sequencialmente no SQL Editor do Supabase 
-- para atualizar o banco de dados em produção.
-- =========================================================================

-- [2026-06-24] Adiciona a flag de compartilhamento com agências nos currículos
-- Comportamento: Por padrão, todo currículo existente e novo terá a flag ativada (true).
ALTER TABLE public.resumes ADD COLUMN is_shared boolean DEFAULT true NOT NULL;
