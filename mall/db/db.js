module.exports = callback => {
  const mysql = require('mysql')
  const host = 'localhost'
  const user = 'root'
  const password = 'chen'
  const database = 'mall'

  const db = mysql.createPool({
    host,
    user,
    password,
    database
  })

  db.getConnection((err, data) => {
    if (err) return callback && callback(err)
    callback && callback(null, db)
  })
}
