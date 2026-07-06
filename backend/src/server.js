const createApp = require('./app');

const PORT = process.env.PORT || 3000;
const app = createApp();

const server = app.listen(PORT, () => {
  console.log(`todo-backend listening on port ${PORT}`);
});

function shutdown(signal) {
  console.log(`${signal} received, shutting down gracefully`);
  server.close(() => {
    console.log('closed remaining connections');
    process.exit(0);
  });
  // Force-exit if connections don't close in time (e.g. during ECS deploys)
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

module.exports = server;
