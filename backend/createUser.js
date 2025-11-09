const bcrypt = require('bcrypt');
const db = require('./src/config/database');

async function createTestUser() {
  const email = 'teste@utfpr.edu.br';
  const password = '123456'; 
  const saltRounds = 10;

  try {
    
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await db.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2)',
      [email, passwordHash]
    );

    console.log('Usuário de teste criado com sucesso!');
    console.log(`Email: ${email}`);
    console.log(`Senha: ${password}`);
  } catch (error) {
    console.error('Erro ao criar usuário:', error.message);
  }
}

createTestUser();