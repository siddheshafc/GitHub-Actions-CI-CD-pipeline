const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const todosRouter = require('./routes/todos');

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '10kb' }));


  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
  });

  app.use('/api/todos', todosRouter);

  const staticDir = path.join(__dirname, '..', 'public');
  app.use(express.static(staticDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(staticDir, 'index.html'), (err) => {
      if (err) next();
    });
  });

  app.use('/api', (req, res) => {
    res.status(404).json({ error: 'not found' });
  });

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'internal server error' });
  });

  return app;
}

module.exports = createApp;
