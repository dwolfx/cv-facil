# Guia de Configuração: Login Social com Google (Supabase)

O login com o Google é simples de configurar e usa o console do Google Cloud Platform (GCP).

---

## 📋 Pré-requisitos
1. Uma conta Google ativa.
2. A URL de redirecionamento (Redirect URI) obtida na tela de login social do Google no Supabase:
   `https://<seu-projeto-ref>.supabase.co/auth/v1/callback`

---

## 🛠️ Passo 1: Criar um Projeto no Google Cloud
1. Acesse o **[Google Cloud Console](https://console.cloud.google.com/)**.
2. Clique no menu suspenso de seleção de projetos no topo esquerdo e selecione **Novo Projeto**.
3. Escolha um nome para o seu projeto (ex: `CV Facil`) e clique em **Criar**.
4. Certifique-se de que o novo projeto esteja selecionado após a criação.

---

## 🛠️ Passo 2: Configurar a Tela de Consentimento OAuth (OAuth Consent Screen)
Antes de gerar as credenciais, o Google exige a configuração da tela que o usuário vê ao fazer login.
1. No menu de navegação à esquerda, vá em **APIs e Serviços** > **Tela de consentimento OAuth**.
2. Selecione o tipo de usuário **Externo** (External) e clique em **Criar**.
3. Preencha as informações obrigatórias da tela:
   * **Informações do aplicativo:** Nome do app (ex: `CV Fácil`), e-mail de suporte ao usuário.
   * **Logotipo do aplicativo:** Opcional.
   * **Domínio do aplicativo:** Opcional na fase de testes.
   * **Dados de contato do desenvolvedor:** Seu e-mail de administrador.
4. Clique em **Salvar e Continuar**.
5. Na aba de **Escopos (Scopes)**, clique em **Adicionar ou remover escopos**.
6. Marque os escopos básicos de perfil:
   * `.../auth/userinfo.email`
   * `.../auth/userinfo.profile`
   * `openid`
7. Clique em **Atualizar** no final da tabela e depois em **Salvar e Continuar**.
8. Na aba **Usuários de teste**, adicione os e-mails das pessoas que poderão testar o login enquanto o app estiver em modo de teste/rascunho (inclua o seu e-mail de teste).
9. Clique em **Salvar e Continuar** e depois em **Voltar para o painel**.

---

## 🛠️ Passo 3: Criar as Credenciais OAuth Client ID
1. No menu lateral, clique em **Credenciais**.
2. No topo da tela, clique em **+ Criar Credenciais** e selecione **ID do cliente OAuth**.
3. Selecione o tipo de aplicativo como **Aplicativo da Web**.
4. Configure as seguintes URLs:
   * **Origens JavaScript autorizadas:** Adicione a URL base do seu banco Supabase:
     `https://<seu-projeto-ref>.supabase.co`
   * **URIs de redirecionamento autorizados:** Adicione a URL completa de redirecionamento fornecida pelo Supabase:
     `https://<seu-projeto-ref>.supabase.co/auth/v1/callback`
5. Clique em **Criar**.
6. Uma janela flutuante será aberta exibindo o seu **ID de cliente** (Client ID) e a **Chave secreta do cliente** (Client Secret).
7. Copie e anote esses dois dados.

---

## 🛠️ Passo 4: Salvar no Supabase
1. Vá no painel do Supabase > **Authentication** > **Providers** > **Google**.
2. Ative a chave de ativação.
3. Cole o **ID do cliente** no campo **Client ID**.
4. Cole a **Chave secreta do cliente** no campo **Client Secret**.
5. Clique em **Save**.

Pronto! O login com o Google está configurado e pronto para uso.
