# Projeto: CV Fácil - Master Document for AI Assistants

Este arquivo (`CLAUDE.md`) atua como o ponto de entrada principal (Entry Point) para qualquer Inteligência Artificial ou LLM que esteja operando neste repositório. O objetivo desta documentação é economizar o contexto inicial, ditando a arquitetura do projeto e as convenções que não devem ser quebradas.

## 🎯 Objetivo do Projeto
**CV Fácil** é uma aplicação Web SaaS (Software as a Service) voltada para a criação, gerenciamento, tradução e exportação de currículos profissionais de alta conversão. Ele utiliza Inteligência Artificial para facilitar traduções e um sistema modular de componentes React.

## 📁 Índice de Documentação Secundária
Para aprofundamento em tópicos específicos, consulte obrigatoriamente os seguintes arquivos antes de realizar modificações estruturais:

- **[DEVELOPMENT.md](./DEVELOPMENT.md):** Arquitetura técnica detalhada, stack (React 19, Vite, Tailwind), estruturas de Contextos (Auth, Resume, Plan), Hooks customizados e Schema do Banco de Dados (Supabase).
- **[DESIGN.md](./DESIGN.md):** Design System, documentação das Variáveis CSS mapeadas via Tailwind, e regras de UI/UX (feedbacks e layouts responsivos).
- **[CHANGELOG.md](./CHANGELOG.md):** Histórico estruturado das versões e features desenvolvidas.
- **[README.md](./README.md):** Visão geral voltada para humanos, instruções de instalação e apresentação para o repositório público no GitHub.

## 🛑 Regras de Ouro (MANDATÓRIAS)

1. **Stack Intocável**:
   - **Frontend:** React (v19) via Vite, com tipagem implícita via arquivos `*.jsx` (NÃO utilize TypeScript neste projeto, o padrão é Javascript puro + ES6+).
   - **Estilização:** TailwindCSS (v3.4+) ancorado em **Variáveis CSS** (presentes em `src/index.css` e mapeadas no `tailwind.config.js`). Nunca utilize cores arbitrárias via HEX direto nas classes do Tailwind (ex: não use `bg-[#f0f0f0]`, use variáveis ou as classes nativas configuradas como `bg-slate-50`).
   - **Backend/DB/Auth:** Supabase v2. Row Level Security (RLS) está ativo, então a autenticação é o que dita o acesso aos dados via queries.

2. **Geração de PDF (Coração do App)**:
   - Toda lógica de exportação de PDF depende da dobradinha `html2canvas` e `jspdf`. Modificações no componente `ResumePreview.jsx` precisam respeitar restrições visuais para que a captura do canvas e a impressão no PDF não quebrem as margens e quebras de página.

3. **Arquitetura Base**:
   - O estado global é gerenciado primariamente pela combinação do Context API (`AuthContext.jsx`) e Custom Hooks (`useResume.js`, `useUserPlan.js`).
   - O roteamento utiliza o novo padrão `createBrowserRouter` do `react-router-dom` v7.

4. **Regras de Estilo e Padrão de Código**:
   - Componentes sempre devem usar a sintaxe Functional Components + Hooks.
   - Tratamento de erro visual: Qualquer ação assíncrona deve retornar feedback ao usuário utilizando o pacote `sonner` (`toast.success()`, `toast.error()`, `toast.promise()`).
   - Imports: Componentes externos/third-party primeiro, hooks internos depois, componentes locais a seguir, estilos no final.

**INSTRUÇÃO FINAL PARA IA:** Ao iniciar um novo prompt neste projeto, **NÃO** perca tempo refatorando a documentação, a menos que solicitado explicitamente. Assuma o contexto dos arquivos `.md` listados acima e parta direto para a resolução de problemas do usuário.
