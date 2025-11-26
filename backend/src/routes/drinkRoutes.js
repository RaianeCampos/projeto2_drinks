const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const NodeCache = require('node-cache');
const { body, query, param, validationResult } = require('express-validator');
const logger = require('../utils/logger');
const verifyToken = require('../middlewares/authMiddleware'); 

const cache = new NodeCache({ stdTTL: 600 });

router.get('/', 
  verifyToken, 
  [
    query('termo').trim().escape()
  ],
  async (req, res) => {
    const { termo } = req.query;
    
    logger.info(`Busca de drinks realizada pelo usuário ${req.userId} com o termo: "${termo || 'todos'}"`);

    const cacheKey = termo ? `search_${termo}` : 'all_drinks';
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      logger.info(`Dados retornados do cache para a chave: ${cacheKey}`);
      return res.json(cachedData);
    }

    try {
      let querySQL = 'SELECT * FROM drinks';
      let params = [];

      if (termo) {
        querySQL += ' WHERE name ILIKE $1 OR ingredients ILIKE $1';
        params = [`%${termo}%`];
      }

      const result = await pool.query(querySQL, params);
      
      cache.set(cacheKey, result.rows);
      logger.info(`Dados da busca armazenados no cache com a chave: ${cacheKey}`);
      
      res.json(result.rows);
    } catch (err) {
      logger.error(`Erro na busca de drinks: ${err.message}`);
      res.status(500).json({ error: 'Erro ao buscar drinks' });
    }
});

router.post('/', 
  verifyToken,
  [
    body('nome').notEmpty().withMessage('Nome é obrigatório').trim().escape(),
    body('ingredientes').notEmpty().withMessage('Ingredientes são obrigatórios').trim().escape(),
    body('receita').notEmpty().withMessage('Receita é obrigatória').trim().escape(),
    body('imagem').optional().trim()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(`Erros de validação: ${JSON.stringify(errors.array())}`);
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, ingredientes, receita, imagem } = req.body;

    logger.info(`Dados recebidos - Nome: ${nome}, Ingredientes: ${ingredientes}, Receita: ${receita}, Imagem: ${imagem}`);

    try {
      const result = await pool.query(
        'INSERT INTO drinks (name, ingredients, instructions, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
        [nome, ingredientes, receita, imagem && imagem.trim() !== '' ? imagem : null]
      );

      cache.flushAll(); 
      logger.info(`Novo drink "${nome}" inserido pelo usuário ${req.userId}. Cache invalidado. Dados: ${JSON.stringify(result.rows[0])}`);

      res.status(201).json({ message: 'Drink inserido com sucesso!', drink: result.rows[0] });
    } catch (err) {
      logger.error(`Erro ao inserir drink: ${err.message}`);
      res.status(500).json({ error: 'Erro ao inserir dados' });
    }
  });
router.get(
  '/:id',
  verifyToken,
  [
    param('id', 'ID inválido').isInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const cacheKey = `drink_${id}`; 

      const cachedDrink = cache.get(cacheKey);
      if (cachedDrink) {
        logger.info(`Retornando drink (ID: ${id}) do cache.`);
        return res.json(cachedDrink);
      }
    
      logger.info(`Buscando drink (ID: ${id}) do banco de dados.`);
      const result = await pool.query('SELECT * FROM drinks WHERE id = $1', [id]);
      const drink = result.rows[0];

      if (!drink) {
        logger.warn(`Tentativa de acesso a drink inexistente. ID: ${id}`);
        return res.status(404).json({ message: 'Drink não encontrado' });
      }
      
      cache.set(cacheKey, drink);
      logger.info(`Drink (ID: ${id}) armazenado no cache.`);
      
      res.json(drink);

    } catch (error) {
      logger.error(`Erro ao buscar detalhes do drink (ID: ${req.params.id}): ${error.message}`);
      res.status(500).json({ message: 'Erro ao buscar detalhes do drink' });
    }
  }
);

module.exports = router;
