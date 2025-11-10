
const db = require('../config/database');

class Drink {
    
  static async searchByName(name) {
    try {
     
      const query = 'SELECT * FROM drinks WHERE name ILIKE $1';
      const params = [`%${name}%`];
      const { rows } = await db.query(query, params);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar drinks:', error);
      throw error;
    }
  }


  static async insert(name, ingredients, instructions, imageUrl) {
    try {
      const query = `
        INSERT INTO drinks (name, ingredients, instructions, image_url, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING *
      `;
      const params = [name, ingredients, instructions, imageUrl];
      const { rows } = await db.query(query, params);
      return rows[0];
    } catch (error) {
      console.error('Erro ao inserir drink:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const { rows } = await db.query(
        'SELECT * FROM drinks WHERE id = $1',
        [id]
      );
      return rows[0]; 
    } catch (error) {
      console.error('Erro ao buscar drink por ID:', error);
      throw error;
    }
  }
}

module.exports = Drink;