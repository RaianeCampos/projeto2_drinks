
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');


const authRoutes = require('./src/routes/authRoutes');
const drinkRoutes = require('./src/routes/drinkRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); 
app.use(helmet()); 
app.use(compression()); 
app.use(express.json()); 
app.use(morgan('dev'));

const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	max: 10, 
	message: { message: 'Muitas tentativas de login a partir deste IP. Tente novamente após 15 minutos.' },
	standardHeaders: true, 
	legacyHeaders: false, 
});

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (token == null) {
    return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Falha na verificação do token:', err.message);
      return res.status(403).json({ message: 'Token inválido ou expirado.' }); 
    }
    req.user = user;
    next();
  });
};

app.use('/api/auth', loginLimiter, authRoutes);

app.use('/api/drinks', verifyToken, drinkRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});