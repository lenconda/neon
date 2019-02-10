module.exports = {
  apps: [{
    name: 'neon-publisher',
    script: './services/publisher.service.js',
  }, {
    name: 'neon-worker',
    script: './services/worker.service.js',
    instances: 5,
    exec_mode: 'fork'
  }]
}
