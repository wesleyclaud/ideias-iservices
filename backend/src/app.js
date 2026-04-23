require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/errorHandler');
const { sequelize } = require('./models');

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', require('./modules/auth/auth.routes'));
app.use('/api/users', require('./modules/users/users.routes'));
app.use('/api/service-orders', require('./modules/serviceOrders/serviceOrders.routes'));
app.use('/api/contracts', require('./modules/contracts/contracts.routes'));
app.use('/api/documents', require('./modules/documents/documents.routes'));
app.use('/api/fuel', require('./modules/fuel/fuel.routes'));
app.use('/api/routes', require('./modules/routes/routes.routes'));
app.use('/api/prospects', require('./modules/prospects/prospects.routes'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'IDEIAS - iServices' }));

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

sequelize.authenticate()
  .then(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('DB conectado.');
    }
    app.listen(PORT, () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`IDEIAS - iServices API rodando na porta ${PORT}`);
      }
    });
  })
  .catch((err) => {
    console.error('Falha ao conectar no banco:', err.message);
    process.exit(1);
  });

module.exports = app;
