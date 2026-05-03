# DESIGN: Sistema, UI/UX e Estilização

Este arquivo documenta as escolhas de design, tokens, e convenções visuais estabelecidas no projeto **CV Fácil**. A interface é projetada para ser minimalista, moderna, e extremamente fluida.

## 🎨 Design System e Tailwind

A estilização utiliza o **TailwindCSS (v3.4.17)** como motor principal, mas a fundação visual baseia-se em **Variáveis CSS** puras definidas em `src/index.css`. Isso foi feito para facilitar mudanças globais rápidas, adaptação para Dark Mode (quando aplicável) e whitelabels.

### Variáveis e Mapeamento

O arquivo `tailwind.config.js` mapeia as variáveis CSS nativas para classes de utilidade do Tailwind:

```css
/* Exemplo de Variáveis Core (src/index.css) */
:root {
  --primary: #2563eb;       /* Tailwind 'blue-600' ish */
  --primary-hover: #1d4ed8; 
  --primary-light: #eff6ff;
  --secondary: #64748b;     /* Tailwind 'slate-500' */
  --bg-body: #f8f9fa;
  
  /* Raios de borda (Border Radius) */
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
}
```

No **Tailwind**, use-os através da chave estendida:
- Text/Background: `text-primary`, `bg-primary`, `bg-primary-light`, `text-slate-blue`
- Border Radius: `rounded`, `rounded-lg`, `rounded-xl` (estes já utilizam as variáveis `var(--radius-*)` estendidas no tailwind.config).

> **Aviso:** Evite criar cores com valores Hex fixos nos arquivos React (ex: `className="text-[#333]"`). Use a paleta estendida do Tailwind ou o slate padrão (`text-slate-800`).

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
