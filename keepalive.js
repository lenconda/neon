const cron = require('node-cron')
const { exec } = require('child_process')

cron.schedule('0 15,45 * * * *', () => {
  exec('pm2 restart neon-publisher')
})
