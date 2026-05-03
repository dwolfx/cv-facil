# CV Fácil 📄🚀

O **CV Fácil** é uma plataforma inovadora de construção, gerenciamento e tradução de currículos projetada para quem busca objetividade e design de alta conversão para o mercado de trabalho. Tudo o que você precisa fazer é preencher suas informações de experiência, e o nosso motor cuida do layout A4 perfeito.

![CV Facil Preview](https://img.shields.io/badge/Status-Em%20Desenvolvimento-orange.svg) 
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-DB_%26_Auth-3ECF8E?logo=supabase)

## ✨ Principais Funcionalidades

- **Editor Real-Time Dinâmico:** Preencha seus dados de um lado e veja o currículo mágico ser renderizado em A4 simulado instantaneamente do outro lado. Tudo responsivo para Mobile.
- **PDF Generation sem Servidor:** O app renderiza seu CV perfeitamente de HTML para PDF através do seu próprio navegador. A privacidade dos dados fica preservada!
- **Tradução Mágica por IA:** Através do clique de um botão, nossa integração com inteligência artificial traduz todo o seu currículo perfeitamente para o Inglês ou Espanhol.
- **Proteção e Versionamento (Dashboard):** Nunca perca um currículo. Duplique-os, edite-os e gere versões segmentadas de si mesmo.

## 💻 Stack Tecnológico

*   **Frontend:** React (Vite), JavaScript puro, TailwindCSS para design elegante e limpo.
*   **Backend & Banco de dados:** Supabase (Autenticação + PostgreSQL serverless com RLS ativado).
*   **Ferramentas e Bibliotecas:** `lucide-react` para ícones vetoriais modernos, `react-router-dom` (v7) para roteamento Single Page Application, e `sonner` para feedback rico de toasts.
*   **Exportação em PDF:** Motor client-side usando `html2canvas` + `jspdf`.

## 🛠️ Como rodar o projeto localmente

### 1. Requisitos Prévios
- [Node.js](https://nodejs.org/) (versão >= 18)
- [Git](https://git-scm.com/)

### 2. Instalação
Clone este repositório para a sua máquina:
```bash
git clone https://github.com/SeuUsuario/cv-facil.git
cd cv-facil
```

Instale todas as dependências:
```bash
npm install
```

### 3. Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto contendo as chaves públicas da sua API Supabase. Exemplo:

```env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key-here"
```

### 4. Rodando o servidor
Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Abra o seu navegador no link que aparecer no terminal (geralmente `http://localhost:5173/`).

## 📚 Documentação (Para Desenvolvedores/IA)
O projeto conta com documentação aprofundada estruturada para facilitar o onboarding da Inteligência Artificial. Se deseja entender nossa arquitetura, acesse:
- [CLAUDE.md](./CLAUDE.md) - Ponto de Entrada para LLMs
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Contexto Profundo de Arquitetura
- [DESIGN.md](./DESIGN.md) - Padrões Visuais e de Interface

## ⚖️ Licença
Este projeto é provido como está. Para detalhes sobre o uso do código proprietário, consulte o arquivo `LICENSE` anexado.
