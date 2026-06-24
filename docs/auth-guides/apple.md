# Guia de Configuração: Login Social com Apple (Supabase)

O login social com a Apple é o mais complexo de ser configurado devido à necessidade de chaves de criptografia assinadas e de uma conta Apple Developer paga ($99/ano).

Abaixo está o passo a passo completo de como obter os dados exigidos pelo Supabase.

---

## 📋 Pré-requisitos
1. Uma conta **Apple Developer** ativa (paga).
2. O domínio do seu projeto Supabase (ex: `https://xyz.supabase.co`).
3. A URL de redirecionamento (Redirect URI) obtida na tela de login social da Apple no Supabase:
   `https://<seu-projeto-ref>.supabase.co/auth/v1/callback`

---

## 🛠️ Passo 1: Criar um App ID
1. Acesse o portal **[Apple Developer Program](https://developer.apple.com/account/)**.
2. Vá em **Certificates, Identifiers & Profiles** > **Identifiers**.
3. Clique no botão de adicionar (`+`) e escolha **App IDs**. Clique em **Continue**.
4. Selecione o tipo **App** e clique em **Continue**.
5. Preencha as informações:
   * **Description:** Ex: `CV Facil App`
   * **Bundle ID (Explicit):** Ex: `com.seuapp.cvfacil`
6. Role para baixo na lista de **Capabilities**, encontre e marque a caixinha **Sign In with Apple**.
7. Clique em **Continue** e depois em **Register**.

---

## 🛠️ Passo 2: Criar um Services ID (Este será o seu Client ID)
O *Services ID* é usado para autenticação via web.
1. Na lista de **Identifiers**, clique no menu suspenso no canto superior direito e selecione **Services IDs**.
2. Clique no botão de adicionar (`+`).
3. Preencha as informações:
   * **Description:** Ex: `CV Facil Web`
   * **Identifier:** Ex: `com.seuapp.cvfacil.sid` (Este texto será o seu **Client ID** no Supabase).
4. Clique em **Continue** e depois em **Register**.
5. Agora, encontre o *Services ID* recém-criado na lista e clique nele para abrir as configurações.
6. Ative a caixinha **Sign In with Apple** e clique em **Configure**.
7. Na janela flutuante:
   * **Primary App ID:** Selecione o App ID que você criou no *Passo 1*.
   * **Web Domains:** Adicione o domínio do seu Supabase sem o `https://` (ex: `<seu-projeto-ref>.supabase.co`).
   * **Return URLs:** Digite a URL de redirecionamento do Supabase completa:
     `https://<seu-projeto-ref>.supabase.co/auth/v1/callback`
8. Clique em **Next**, depois em **Done**, e em **Save** no canto superior direito para aplicar as alterações.

---

## 🛠️ Passo 3: Criar a Chave Privada (.p8) e Obter o Key ID
Esta chave é usada para assinar as requisições enviadas para a Apple.
1. Vá em **Keys** (no menu lateral esquerdo do painel Apple Developer).
2. Clique no botão de adicionar (`+`).
3. Preencha as informações:
   * **Key Name:** Ex: `CV Facil Auth Key`
   * **Sign in with Apple:** Marque esta caixinha e clique em **Configure**.
   * Escolha o seu **Primary App ID** criado no *Passo 1*.
4. Clique em **Save**, depois em **Continue** e em **Register**.
5. **ATENÇÃO:** Baixe o arquivo de chave privada (um arquivo `.p8` que se parece com `AuthKey_XXXXXXXXXX.p8`).
   > ⚠️ **IMPORTANTE:** Você só pode baixar este arquivo **uma única vez**. Guarde-o em um local seguro.
6. Copie e anote o **Key ID** exibido na tela (um código alfanumérico de 10 dígitos).
7. Copie e anote o seu **Team ID** (localizado no canto superior direito da tela do portal Apple Developer).

---

## 🛠️ Passo 4: Gerar a Chave Secreta (Secret Key - JWT)
A Apple exige que o Client Secret seja um token JWT assinado usando a chave `.p8` baixada no passo anterior. A validade máxima deste token permitida pela Apple é de **6 meses** (180 dias), necessitando de renovação após este período.

Para simplificar sua vida, criamos um script utilitário em nosso projeto para gerar isso automaticamente sem instalar nenhuma dependência externa.

### Como gerar:
1. Copie o arquivo `.p8` que você baixou da Apple e cole no diretório `scripts/` do projeto.
2. Abra o arquivo **[generate-apple-secret.js](file:///c:/Sites/cv-facil/scripts/generate-apple-secret.js)**.
3. Preencha as constantes com seus dados reais anotados nos passos anteriores:
   * `TEAM_ID` (Seu Team ID de 10 dígitos da Apple)
   * `CLIENT_ID` (O identificador do seu Services ID criado no Passo 2, ex: `com.seuapp.cvfacil.sid`)
   * `KEY_ID` (O Key ID de 10 dígitos da chave privada)
   * `PRIVATE_KEY_PATH` (O nome do arquivo `.p8` que você colou na pasta scripts)
4. Execute o script no terminal usando o Node.js:
   ```bash
   node scripts/generate-apple-secret.js
   ```
5. O script imprimirá uma chave JWT longa no terminal. Copie essa chave.

---

## 🛠️ Passo 5: Salvar no Supabase
1. Vá no painel do Supabase > **Authentication** > **Providers** > **Apple**.
2. Cole o **Services ID** (ex: `com.seuapp.cvfacil.sid`) no campo **Client IDs**.
3. Cole a longa chave JWT gerada pelo script no campo **Secret Key (for OAuth)**.
4. Clique em **Save**.

Pronto! O login com Apple está totalmente configurado.
