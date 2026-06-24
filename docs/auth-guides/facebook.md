# Guia de Configuração: Login Social com Facebook (Supabase)

O login com o Facebook utiliza a plataforma Meta for Developers.

---

## 📋 Pré-requisitos
1. Uma conta pessoal no Facebook ativa.
2. A URL de redirecionamento (Redirect URI) obtida na tela de login social do Facebook no Supabase:
   `https://<seu-projeto-ref>.supabase.co/auth/v1/callback`

---

## 🛠️ Passo 1: Criar um Aplicativo de Desenvolvedor no Meta
1. Acesse o portal **[Meta for Developers](https://developers.facebook.com/)** e faça login.
2. No menu superior direito, clique em **Meus aplicativos** (My Apps).
3. Clique no botão verde **Criar aplicativo** (Create App).
4. Selecione o tipo de aplicativo. Para suporte básico a login web, você pode escolher **Permitir que as pessoas façam login com a conta do Facebook** (ou selecionar a categoria **Consumidor** ou **Outro** > **Consumidor**).
5. Preencha as informações:
   * **Nome de exibição do aplicativo:** Ex: `CV Fácil`
   * **E-mail de contato do aplicativo:** Seu e-mail de desenvolvedor.
6. Clique em **Criar aplicativo**. Digite sua senha do Facebook para confirmar.

---

## 🛠️ Passo 2: Adicionar o Produto de Login do Facebook
1. No painel do seu aplicativo recém-criado, role para baixo até ver os produtos disponíveis e clique em **Configurar** no painel do produto **Login do Facebook**.
2. Selecione a plataforma **Web (WWW)**.
3. Insira a URL do seu site (pode ser o link temporário do Vercel ou o seu domínio de produção, ex: `https://cv-facil.com`) no campo **URL do site** e clique em **Salvar** e **Continuar**.
4. Pule os outros passos sugeridos no assistente do Facebook e clique em **Configurações** no menu à esquerda, sob **Login do Facebook** (não use as Configurações gerais do painel).
5. Na tela de configurações do Login do Facebook:
   * Certifique-se de que a opção **Login do OAuth do cliente** está ativada.
   * Certifique-se de que a opção **Login do OAuth da Web** está ativada.
   * Em **URIs de redirecionamento do OAuth válidos**, cole a URI completa do Supabase:
     `https://<seu-projeto-ref>.supabase.co/auth/v1/callback`
6. Clique em **Salvar alterações** no rodapé da página.

---

## 🛠️ Passo 3: Obter Credenciais do Aplicativo
1. No menu de navegação principal à esquerda do painel da Meta, expanda **Configurações** e selecione **Básica**.
2. Nessa tela você encontrará:
   * **ID do aplicativo** (Este é o seu **Client ID**).
   * **Chave secreta do aplicativo** (Clique em **Mostrar** para revelar. Este é o seu **Client Secret**).
3. Copie e anote esses dois dados.

---

## 🛠️ Passo 4: Salvar no Supabase
1. Vá no painel do Supabase > **Authentication** > **Providers** > **Facebook**.
2. Ative o provedor.
3. Cole o **ID do aplicativo** no campo **Client ID**.
4. Cole a **Chave secreta do aplicativo** no campo **Client Secret**.
5. Clique em **Save**.

Pronto! O login com o Facebook está configurado.
