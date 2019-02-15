const cron = require('node-cron')
const { exec } = require('child_process')

cron.schedule('0 0,15,30,45 * * * *', () => {
  exec('pm2 restart neon-publisher')
})
