# DEVELOPMENT: Arquitetura, Tecnologias e API

Este arquivo descreve a arquitetura profunda do projeto CV Fácil para que IAs possam agir de imediato em integrações, chamadas de banco de dados e gerência de estado.

## 🛠️ Stack Tecnológico
- **Core:** Vite + React v19
- **Linguagem:** Javascript ES6+ (Sem TypeScript).
- **Roteamento:** `react-router-dom` v7 (padrão `createBrowserRouter` via `src/App.jsx`).
- **Backend / Database / Auth:** `supabase-js` v2.
- **Tradução via IA (LLM):** Integração com Gemini (`@google/genai`) e DeepL Proxy (`/api-deepl`).
- **Geração de PDF:** `html2canvas` (Rasterização) + `jspdf` (Montagem PDF).
- **Ícones:** `lucide-react`.

## 📂 Estrutura de Diretórios de Desenvolvimento (`src/`)

- `/components`: Componentes reaproveitáveis globais (Sidebar, Header, Modals, botões, ícones customizados).
- `/contexts`: Provedores de estado Global. Destaca-se `AuthContext.jsx`.
- `/hooks`: Custom Hooks responsáveis por lógicas complexas de domínio. `useResume.js`, `useUserPlan.js`.
- `/pages`: Onde a regra de negócios e o layout da View vivem (`Landing`, `Dashboard`, `Editor`, `Auth/*`).
- `/services`: Clientes de API, instâncias globais. Contém a configuração crua do `supabaseClient.js`.
- `/utils`: Utilitários puros sem efeitos colaterais. Regras de negócios isoladas, parse de strings, ou lógicas complexas de exportação (ex: `pdfGenerator.js`).

## 🗄️ Supabase Schema & Entidades

O backend reside totalmente na Nuvem via Supabase. A estrutura relacional é regida por Row Level Security (RLS). A IA não deve sugerir endpoints de backend em Node/Express (a menos que seja funções Edge), a comunicação é serverless.

1. **`auth.users` (Tabela Nativa Supabase)**: Lida com JWT e Autenticação.
2. **`public.profiles`**: Extendida a partir da Auth.Users (criada via Trigger na Inserção da auth.user).
   - Campos Principais: `id` (uuid, FK), `full_name` (text), `plan_tier` (text)
   - `plan_tier` possíveis valores: `'free'`, `'premium'`, `'lifetime'`.
3. **`public.resumes`**: O Core dos dados.
   - Campos Principais: `id` (bigint), `user_id` (uuid, FK), `title` (text), `content` (jsonb), `strength` (int).
   - **`content` (JSONB):** A mágica mora aqui. Tudo do currículo (experiências, educação, dados pessoais, skills) não tem estrutura relacional. É um enorme objeto Javascript/JSON salvo nesta coluna. Isso garante enorme flexibilidade ao Editor.

## 🔌 Lógica de PDF (Exportação)
Gerar um CV não usa APIs de backend. Usamos Client-Side generation para economizar custos de server e ter preview idêntico à exportação.
1. `html2canvas` escaneia o nó do DOM real (na view do `ResumePreview.jsx`).
2. Ele transforma a NodeTree HTML em uma Imagem PNG base64.
3. `jspdf` instancia um documento "A4" em milímetros, anexa a imagem base64 na exata proporção, e força o download do arquivo no client (navegador).

## 🪝 Contextos e Hooks de destaque

### `useResume(user, resumeId)`
O hook central do negócio. Ele faz todo o peso-pesado na view `/editor`.
- Responsável por carregar o CV do Supabase se houver `resumeId`.
- Monitorar e lidar com `updateField` para campos profundos no objeto `content` do tipo JSONB.
- Tratar auto-save (se ativado) ou lógica "isDirty" para evitar que o usuário saia sem salvar.

### `useUserPlan(user)`
Analisa o `plan_tier` salvo no perfil do Supabase e retorna os "features" liberados: `maxResumes`, `isPremium` booleans, etc. Usado como um gatekeeper de limites (PlanWidget, Bloqueio de novos CVs).

## 🌍 Integrações Externas (Proxies)
As requisições para a API do DeepL utilizam um proxy criado no servidor de desenvolvimento do **Vite** para não bloquear por CORS:
```javascript
// vite.config.js proxy rules
proxy: {
    '/api-deepl': { target: 'https://api-free.deepl.com', changeOrigin: true }
}
```
Lembre-se que em produção (ex: Vercel, Netlify), a API deve ser repassada por serverless functions equivalentes, já que a configuração do Vite Proxy morre no `npm run build`.
