const mysql = require('mysql2/promise')

require('dotenv').config()

const config = {
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'moodle'
  
}

const pool = mysql.createPool(config)

module.exports = pool