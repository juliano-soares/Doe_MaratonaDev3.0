const express = require('express')
const server = express()
const nunjunks = require('nunjucks')

server.use(express.static('public'))
server.use(express.urlencoded({ extended: true}))
nunjunks.configure('./', {
  express: server,
  noCache: true,
})

const Pool = require('pg').Pool
const db = new Pool({
  user: 'postgres',
  password: '1234',
  host: 'localhost',
  port: 5433,
  database: 'doe'
})

server.get('/', function(req, res) {
  
    db.query("SELECT * FROM donors", function(err, result) {
      if(err) return res.send("erro de banco de dados.")
      const donors = result.rows
      return res.render('index.html',{ donors })
    })
})

server.post('/', function(req, res) {
  const name = req.body.name
  const email = req.body.email
  const blood = req.body.blood

  if (name == "" || email == "" || blood == "") {
    return res.send("Todos os campos são obrigatórios.")
  }

  const query = `INSERT INTO donors ("name", "email", "blood") VALUES ($1, $2, $3)`
  const values = [name, email, blood]
  db.query(query, values, function(err) {
    if (err) return res.send('erro no banco de dados.')

    return res.redirect('/')
  })
})

server.listen(4000, function() {
  console.log("start server");
})
