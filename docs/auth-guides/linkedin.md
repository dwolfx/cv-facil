# Guia de Configuração: Login Social com LinkedIn (Supabase)

O login com o LinkedIn utiliza a API OpenID Connect (OIDC) do portal de desenvolvedores do LinkedIn.

---

## 📋 Pré-requisitos
1. Uma conta LinkedIn pessoal e uma **Página do LinkedIn** (Company Page) criada à qual você tenha acesso de administrador. O LinkedIn exige que aplicativos de desenvolvimento sejam associados a uma página comercial real ou fictícia.
2. A URL de redirecionamento (Redirect URI) obtida na tela de login social do LinkedIn no Supabase:
   `https://<seu-projeto-ref>.supabase.co/auth/v1/callback`

---

## 🛠️ Passo 1: Criar um Aplicativo no LinkedIn Developers
1. Acesse o portal **[LinkedIn Developer Portal](https://www.linkedin.com/developers/)**.
2. Clique no botão azul **Create app**.
3. Preencha as informações do formulário:
   * **App name:** Nome do seu site/app (ex: `CV Fácil`).
   * **LinkedIn Page:** Digite o nome ou URL da página de empresa à qual deseja associar o app (se você não tiver uma, crie uma rápida no LinkedIn).
   * **Privacy policy URL:** Opcional (pode colocar a URL de termos do seu site).
   * **App logo:** Faça o upload do ícone/logo da sua marca.
4. Marque a caixinha de termos e clique em **Create app**.

---

## 🛠️ Passo 2: Solicitar Acesso ao Produto Sign In
No LinkedIn, os escopos de autenticação são distribuídos como "produtos" dentro do aplicativo.
1. No menu superior do seu aplicativo recém-criado, clique na aba **Products**.
2. Procure pelo produto **Sign In with LinkedIn using OpenID Connect** (OIDC).
   * *Atenção:* Use o que possui "using OpenID Connect" pois a autenticação antiga está obsoleta.
3. Clique em **Request access** (Solicitar acesso) para este produto.
4. Aceite os termos. A aprovação deste produto costuma ser instantânea.

---

## 🛠️ Passo 3: Configurar Autenticação e Redirect URIs
1. Clique na aba **Auth** no menu superior do seu aplicativo.
2. Na seção **OAuth 2.0 settings**, clique no ícone de lápis para editar as URLs.
3. Clique em **+ Add redirect URL** e cole a URI de redirecionamento fornecida pelo Supabase:
   `https://<seu-projeto-ref>.supabase.co/auth/v1/callback`
4. Clique em **Update** para salvar.
5. Na mesma aba **Auth**, na seção **Application credentials**, você verá o seu **Client ID** e o **Client Secret** (revelado ao clicar no olho).
6. Copie e anote esses dois dados.

---

## 🛠️ Passo 4: Salvar no Supabase
1. Vá no painel do Supabase > **Authentication** > **Providers** > **LinkedIn**.
   * *Dica:* Se houver mais de uma opção no Supabase, selecione o **LinkedIn (OIDC)** que corresponde ao novo padrão.
2. Ative o provedor.
3. Cole o **Client ID** obtido no LinkedIn no campo correspondente.
4. Cole o **Client Secret** no campo correspondente.
5. Clique em **Save**.

Pronto! O login com o LinkedIn está configurado.
