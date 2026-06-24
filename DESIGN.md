# DESIGN: Sistema, UI/UX e Estilização

Este arquivo documenta as escolhas de design, tokens, e convenções visuais estabelecidas no projeto **CV Fácil**. A interface é projetada para ser minimalista, moderna, e extremamente fluida.

## 🎨 Design System e Tailwind

A estilização utiliza o **TailwindCSS (v3.4.17)** como motor principal, mas a fundação visual baseia-se em **Variáveis CSS** puras definidas em `src/index.css`. Isso foi feito para facilitar mudanças globais rápidas, adaptação para Dark Mode (quando aplicável) e whitelabels.

### Variáveis e Mapeamento

O arquivo `tailwind.config.js` mapeia as variáveis CSS nativas (localizadas em `src/styles/variables.css`) para classes de utilidade do Tailwind:

```css
/* Variáveis Core (src/styles/variables.css) */
:root {
  --primary: #ff8000;         /* Laranja Principal CV Fácil */
  --primary-hover: #cc6600;   /* Laranja Escuro para Hover */
  --primary-light: #fff0e0;   /* Laranja Claro para fundos */
  --secondary: #475569;       /* Slate Blue */
  --bg-body: var(--slate-50);
  
  /* Gradientes & Efeitos */
  --gradient-main: linear-gradient(135deg, var(--primary) 0%, #ff5500 100%);
  --shadow-glow: 0 0 20px rgba(255, 128, 0, 0.3);

  /* Raios de borda (Border Radius) */
  --radius-sm: 0.125rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
}
```

No **Tailwind**, use-os através da chave estendida:
- Text/Background: `text-primary`, `bg-primary`, `bg-primary-light`, `bg-gradient-main`, `shadow-glow`
- Border Radius: `rounded`, `rounded-lg`, `rounded-xl`, `rounded-2xl`

## ✍️ Escala de Tipografia Global
A escala tipográfica foi ajustada para manter os textos compactos e equilibrados em telas de todos os tamanhos (definida em `src/styles/global.css`):
* **Família Tipográfica:** `'Inter', system-ui, -apple-system, sans-serif`
* **Heading 1 (h1):** `2.25rem` (~36px) — Usado em títulos principais e seções de destaque do Hero.
* **Heading 2 (h2):** `1.75rem` (~28px) — Usado em títulos de seções principais da Landing Page e do Dashboard.
* **Heading 3 (h3):** `1.35rem` (~21px) — Usado em títulos secundários, cabeçalhos de cards e blocos internos.

> **Aviso:** Evite criar cores com valores Hex fixos nos arquivos React (ex: `className="text-[#ff8000]"`). Use a paleta estendida do Tailwind (`text-primary`) ou o slate padrão (`text-slate-800`).

## 🧱 Componentes de UI e Feedback

O sistema prioriza Feedback claro ao usuário sobre o estado de cada ação (Loading, Success, Error).

### Notificações
Nós utilizamos a biblioteca `sonner` globalmente para Toasts.
Sempre que o usuário dispara uma promessa (Promise) no Supabase ou alguma ação como salvar o Currículo:
```javascript
import { toast } from 'sonner'

// Promessas
toast.promise(saveData(), {
    loading: 'Salvando...',
    success: 'Salvo com sucesso!',
    error: 'Falha ao salvar.'
})
// Simples
toast.success('Currículo criado!')
toast.error('O título é obrigatório.')
```

### Loading States
As telas principais (`Dashboard`, `Editor`) possuem estados de bloqueio onde o ícone `Loader2` da biblioteca `lucide-react` é renderizado (geralmente girando: `animate-spin text-slate-400`).

## 📐 Editor e Currículo (A Visão Principal)

O layout central (Página `Editor`) é dividido em:
1. **Sidebar Esquerda (Painel de Edição):** Formulários focados na injeção de dados. Em dispositivos móveis, ele se transforma em uma aba que desliza.
2. **Painel Direito (Preview):** Uma área de Stage que simula papel A4 (padrão 210x297mm).

### Lógica de Visualização A4
O currículo em si (o que o usuário vai imprimir/exportar) precisa manter proporções rígidas.
- A classe do preview usa `min-h-[297mm]`, simulando o tamanho A4.
- Há um cálculo em tela que gera um "zoom" CSS via `transform: scale()` para fazer a folha A4 inteira caber em monitores menores sem scroll duplo.

## 📱 Responsividade (Mobile-First Workflow)

Embora o motor de PDF demande uma visão estática A4, todo o resto da aplicação (Dashboard, Formulários de Edição, Configurações) utiliza breakpoints do Tailwind:
- Default: Dispositivos móveis.
- `md:` Tablet e Desktop menor (Sidebars fixas aparecem a partir daqui, antes disso usa-se Bottom Bar ou menus estilo Hamburguer/gaveta deslizante).
- `lg:` / `xl:` Desktop amplo (Grid de currículos salta de 2 colunas para 3 ou 4).
