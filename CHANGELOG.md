# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato baseia-se em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).
Embora estejamos num ciclo de SaaS ágil, o registro de grandes épicos estruturais ajuda IAs futuras a entenderem a cronologia do código.

## [1.0.0] - 2026-05-02
### Added
- **Core SaaS Base**: Configuração completa com Vite, React 19, e TailwindCSS v3.
- **Autenticação e DB**: Supabase configurado e estruturado. Fluxos completos de `/login`, `/register`, Reset e Forgot Password usando a engine nativa `auth.users`.
- **Database Schema**: Tabelas `profiles` associada ao usuário, e tabela principal `resumes` utilizando coluna JSONB para gerência escalável da estrutura do CV. Triggers em PL/pgSQL geram o `profile` vazio quando a conta é criada.
- **Gerenciador (Dashboard)**: Grid listando currículos com ações em Dropdown (Renomear, Duplicar, Deletar, Download e Tradução).
- **Ações de Plano/Limites**: Controle real de `plan_tier` ('free' limitando a máximo 2 currículos) operado por um `useUserPlan` hook em sincronia com o banco de dados.
- **Editor Central (Resume Builder)**: Layout responsivo. Formulários dinâmicos de dados pessoais, idiomas, hard/soft skills, experiências profissionais e educação com injeção profunda no JSONB.
- **Motor Client-Side PDF**: Função exportadora utilizando `html2canvas` para rasterizar o HTML e `jspdf` para criar o PDF paginado estilo A4 em nível client-side.
- **Integração IA/API Tradução**:
  - Gemini SDK (`@google/genai`) acoplado no `package.json`.
  - Função no Dashboard que chama a proxy `/api-deepl` (DeepL) ou serviço customizado (`translateResume`) para converter imediatamente o CV em Inglês ou Espanhol, lidando com todo o objeto JSON de uma vez.
- **Feedback Visual**: Instalação e uso do pacote `sonner` para toasts/modais robustos em vez do padrão lento do navegador.

## [1.1.0] - 2026-06-24
### Added
- **Compartilhamento de Currículos (Visibilidade de Recrutadores):**
  - Implementado o controle de compartilhamento padrão com agências de recrutamento com opção de opt-out (checkbox "Compartilhar com agências" nos cards do painel).
  - Atualizado o esquema do banco de dados local (`supabase_schema.sql`) e criado script delta de migração (`executar_no_supabase.sql`) contendo a query incremental para adicionar a coluna `is_shared`.
- **Seção de Visibilidade & WhatsApp Mockup:**
  - Criada uma nova seção interativa na Landing Page detalhando a exposição passiva do currículo a agências.
  - Incluído um mockup dinâmico que simula uma mensagem de recrutador enviada diretamente ao WhatsApp do candidato, contendo a ação "Responder Recrutador".
- **Autenticação Unificada:**
  - Unificadas as telas de login e cadastro em um único componente moderno (`Auth.jsx`) e rota única `/login`.
  - Adicionado suporte a parâmetros de consulta (`?mode=login` e `?mode=register`) com sincronização do histórico do navegador (`setSearchParams`) para persistir o estado do formulário na URL.
- **Guias de Login Social & Gerador Apple:**
  - Criados guias completos passo a passo para configuração de autenticação externa com Google, Apple, LinkedIn e Facebook em `docs/auth-guides/`.
  - Criado o script utilitário `scripts/generate-apple-secret.js` com zero dependências externas para gerar o Client Secret JWT exigido pela integração da Apple.
- **Bandeiras de Idioma nos Cards:**
  - Substituída a antiga tag textual (`PT-BR`, `EN`, `ES`) por uma bandeira plana (SVG) correspondente ao idioma do currículo (Brasil, Inglaterra e Espanha) posicionada inline na linha de metadados antes do relógio.
