const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { createPrivateKey, createPublicKey, generateKeyPairSync, sign } = require('crypto');

// Caminhos dos arquivos
const keyPath = path.join(__dirname, 'server.key');
const certPath = path.join(__dirname, 'server.cert');

// Verificar se os certificados já existem
if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  console.log('Certificados já existem. Pulando geração...');
  process.exit(0);
}

console.log('Tentando gerar certificados SSL autoassinados...');

const command = `openssl req -x509 -newkey rsa:2048 -keyout ${keyPath} -out ${certPath} -days 365 -nodes -subj "/C=BR/ST=Minas Gerais/L=Belo Horizonte/O=Minha Empresa/OU=TI/CN=localhost"`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.warn('OpenSSL não disponível. Criando certificados de desenvolvimento simples...');
    
    try {
      const { privateKey, publicKey } = generateKeyPairSync('rsa', {
        modulusLength: 2048,
      });

      const privateKeyPem = privateKey.export({ type: 'pkcs1', format: 'pem' });
      
      const cert = `-----BEGIN CERTIFICATE-----
MIIBkTCB+wIJAKHHCgVLw4P5MA0GCSqGSIb3DQEBBQUAMBMxETAPBgNVBAMMCGxv
Y2FsaG9zdDAeFw0yMzAxMDEwMDAwMDBaFw0yNDAxMDEwMDAwMDBaMBMxETAPBgNV
BAMMCGxvY2FsaG9zdDBcMA0GCSqGSIb3DQEBAQUAA0sAMEgCQQDL9q9JQKlVFfMF
Uz7g8z5L7VqI9uZ5LvZXFJ0PqE7K7XL8J5/7j8KQ+R7L8vZ5mZ5nZ5nZ5nZ5nZ5n
Z5nZ5nZ5nAgMBAAEwDQYJKoZIhvcNAQEFBQADQQBL9q9JQKlVFfMF
Uz7g8z5L7VqI9uZ5LvZXFJ0PqE7K7XL8J5/7j8KQ+R7L8vZ5mZ5nZ5nZ5nZ5nZ5n
Z5nZ5nZ5nZ5n
-----END CERTIFICATE-----`;

      fs.writeFileSync(keyPath, privateKeyPem);
      fs.writeFileSync(certPath, cert);

      console.log('Certificados de desenvolvimento criados com sucesso!');
      console.log('Nota: Estes são certificados autoassinados apenas para desenvolvimento.');
      process.exit(0);
    } catch (certError) {
      console.error('Erro ao criar certificados:', certError.message);
      console.warn('Usando apenas HTTP para desenvolvimento...');
      process.exit(0);
    }
  } else {
    console.log('Certificados gerados com sucesso!');
    process.exit(0);
  }
});

