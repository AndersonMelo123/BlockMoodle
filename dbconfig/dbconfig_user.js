const mysql = require('mysql2/promise')

require('dotenv').config()

const configUser = {
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'blockmoodle'
  
}

const poolUser = mysql.createPool(configUser);

module.exports = poolUser;