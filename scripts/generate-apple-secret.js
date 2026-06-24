const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// ==========================================
// CONFIGURAÇÕES DO PROVEDOR APPLE DEVELOPER
// ==========================================
// Substitua os dados abaixo pelos seus dados obtidos no Apple Developer Portal.
// Leia o guia em: docs/auth-guides/apple.md para mais informações.
const TEAM_ID = 'YOUR_TEAM_ID';                  // Seu Team ID de 10 dígitos (canto superior direito no portal)
const CLIENT_ID = 'YOUR_SERVICES_ID';            // O Identifier do seu Services ID (ex: com.seuapp.cvfacil.sid)
const KEY_ID = 'YOUR_KEY_ID';                    // O Key ID de 10 dígitos da sua chave privada .p8
const PRIVATE_KEY_FILENAME = 'AuthKey_XXXXXXXXXX.p8'; // Nome do arquivo .p8 que você baixou da Apple e colou nesta pasta

// ==========================================
// FUNÇÃO PARA GERAR O CLIENT SECRET (JWT)
// ==========================================
function generateAppleClientSecret() {
  if (TEAM_ID === 'YOUR_TEAM_ID' || CLIENT_ID === 'YOUR_SERVICES_ID' || KEY_ID === 'YOUR_KEY_ID') {
    console.error('\n❌ ERRO: Por favor, configure as constantes (TEAM_ID, CLIENT_ID, KEY_ID) com seus dados reais da Apple.');
    console.error('Consulte as instruções no arquivo docs/auth-guides/apple.md.\n');
    process.exit(1);
  }

  const privateKeyPath = path.join(__dirname, PRIVATE_KEY_FILENAME);

  if (!fs.existsSync(privateKeyPath)) {
    console.error(`\n❌ ERRO: Arquivo de chave privada não encontrado em: ${privateKeyPath}`);
    console.error(`Por favor, baixe o arquivo .p8 da Apple, renomeie/salve como "${PRIVATE_KEY_FILENAME}" e cole nesta pasta scripts/\n`);
    process.exit(1);
  }

  try {
    const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

    // 1. Cabeçalho (Header) do JWT
    const header = {
      alg: 'ES256',
      kid: KEY_ID,
      typ: 'JWT'
    };

    // 2. Carga Útil (Payload) do JWT
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: TEAM_ID,
      iat: now,
      exp: now + (180 * 24 * 60 * 60), // 180 dias de expiração (cerca de 6 meses - limite máximo permitido pela Apple)
      aud: 'https://appleid.apple.com',
      sub: CLIENT_ID
    };

    // Função auxiliar para codificar Base64URL
    const base64UrlEncode = (obj) => {
      return Buffer.from(JSON.stringify(obj))
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    };

    // Juntar Header e Payload
    const tokenParts = [
      base64UrlEncode(header),
      base64UrlEncode(payload)
    ].join('.');

    // 3. Assinar o token com algoritmo ES256 usando a chave privada (.p8)
    const sign = crypto.createSign('SHA256');
    sign.update(tokenParts);
    const signature = sign.sign(privateKey, 'base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    const jwt = [tokenParts, signature].join('.');

    console.log('\n==================================================================');
    console.log('🎉 CLIENT SECRET (JWT) GERADO COM SUCESSO!');
    console.log('==================================================================');
    console.log('\nCopie o código abaixo e cole no campo "Secret Key (for OAuth)" no Supabase:\n');
    console.log(jwt);
    console.log('\n==================================================================');
    console.log('⚠️ IMPORTANTE: Este token expira em 6 meses (180 dias).');
    console.log('Após esse período, gere um novo token rodando este script novamente.');
    console.log('==================================================================\n');

  } catch (error) {
    console.error('\n❌ ERRO ao gerar o token da Apple:', error.message);
    console.error('Verifique se a chave privada .p8 foi baixada corretamente e se os dados estão preenchidos de forma válida.\n');
  }
}

generateAppleClientSecret();
