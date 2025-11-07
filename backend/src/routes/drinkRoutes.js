const express = require('express');
const router = express.Router();
const { body, query, validationResult } = require('express-validator');
const Drink = require('../models/Drink');

router.get(
  '/search',
  [
    query('name', 'Termo de busca é necessário').notEmpty().trim().escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name } = req.query;
      const results = await Drink.searchByName(name);
      
      console.log(`Busca realizada por "${name}" pelo usuário ID ${req.user.userId}`);
      
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar drinks' });
    }
  }
);

router.post(
  '/insert',
  [
    body('name', 'Nome é obrigatório').notEmpty().trim().escape(),
    body('ingredients', 'Ingredientes são obrigatórios').notEmpty().trim().escape(),
    body('instructions', 'Instruções são obrigatórias').notEmpty().trim().escape(),
    body('imageUrl', 'URL da imagem inválida').optional({ checkFalsy: true }).isURL(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, ingredients, instructions, imageUrl } = req.body;
      const newDrink = await Drink.insert(name, ingredients, instructions, imageUrl);
      
      console.log(`Novo drink inserido (ID: ${newDrink.id}) pelo usuário ID ${req.user.userId}`);
      
      res.status(201).json(newDrink);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao inserir drink' });
    }
  }
);

module.exports = router;