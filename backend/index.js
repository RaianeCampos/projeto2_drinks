
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const logger = require('./src/utils/logger');

const authRoutes = require('./src/routes/authRoutes');
const drinkRoutes = require('./src/routes/drinkRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de segurança e otimização
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());

// Middleware de log com Morgan, direcionando para o Winston
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Limiter para rotas de autenticação
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10,
    message: { message: 'Muitas tentativas de login a partir deste IP. Tente novamente após 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rotas
app.use('/api/auth', loginLimiter, authRoutes);
app.use('/api/drinks', drinkRoutes); // O middleware de token já está em authRoutes se necessário

// Middleware para tratamento de erros centralizado
app.use((err, req, res, next) => {
    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(err.status || 500).json({ error: 'Erro interno do servidor' });
});

// Configuração do servidor HTTPS/HTTP
const startServer = () => {
  const keyPath = path.join(__dirname, 'server.key');
  const certPath = path.join(__dirname, 'server.cert');
  
  // Tentar iniciar com HTTPS se os certificados existirem
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    try {
      const httpsOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
      };

      https.createServer(httpsOptions, app).listen(PORT, () => {
        logger.info(`Servidor HTTPS rodando na porta ${PORT}`);
      });
    } catch (error) {
      logger.error('Erro ao iniciar servidor HTTPS, usando HTTP como fallback:', error.message);
      app.listen(PORT, () => {
        logger.info(`Servidor HTTP (fallback) rodando na porta ${PORT}`);
      });
    }
  } else {
    // Se os certificados não existirem, usar HTTP
    logger.info('Certificados SSL não encontrados. Usando HTTP para desenvolvimento.');
    app.listen(PORT, () => {
      logger.info(`Servidor HTTP rodando na porta ${PORT}`);
    });
  }
};

startServer();
