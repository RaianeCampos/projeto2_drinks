const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    logger.warn(`Acesso negado. Nenhum token fornecido para ${req.originalUrl} do IP ${req.ip}`);
    return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      logger.error(`Falha na verificação do token: ${err.message}`);
      return res.status(403).json({ message: 'Token inválido ou expirado.' });
    }
    req.userId = decoded.userId; 
    next();
  });
};

module.exports = verifyToken;
