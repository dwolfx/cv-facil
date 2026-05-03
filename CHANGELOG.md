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
