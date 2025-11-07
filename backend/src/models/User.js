const db = require('../config/database');

class User {
  
  static async findByEmail(email) {
    try {
      const { rows } = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return rows[0];
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  }
}

module.exports = User;