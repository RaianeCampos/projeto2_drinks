const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

router.post(
  '/login',
  [
    body('email', 'Email inválido').isEmail().normalizeEmail(),
    body('password', 'Senha não pode estar em branco').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
     
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      
      const user = await User.findByEmail(email);
      if (!user) {

        console.warn(`Tentativa de login falha (usuário não encontrado): ${email}`);
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        console.warn(`Tentativa de login falha (senha incorreta): ${email}`);
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      const payload = {
        userId: user.id,
        email: user.email,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h', 
      });

      res.json({
        message: 'Login bem-sucedido!',
        token: token,
      });

    } catch (error) {
      console.error('Erro no servidor durante o login:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
);

module.exports = router;