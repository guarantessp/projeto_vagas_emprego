const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const path = require('path')
const PORT = 3000
const db = require('./db/connection')
const bodyParse = require('body-parser')
const job = require('./models/Job')
const Job = require('./models/Job')
const sequelize = require('sequelize')
const Op = sequelize.Op

app.listen(PORT, function(){
  console.log(`o express esta rodando na porta ${PORT}`)
})

// body parser
app.use(bodyParse.urlencoded({extended: false}))

// handle bars
app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

//static folder
app.use(express.static(path.join(__dirname, 'public')))

// db connection
db.authenticate()
.then(() => {
  console.log('Conectou ao banco de dados')
})
.catch((err) => {
  console.log('ocorreu um erro', err)
})

// Routes
app.get('/', (req, res) => {

  let search = req.query.job
  let query = '%'+search+'%'

  if(!search){
    Job.findAll({order: [
      ['createdAt', 'DESC']
    ]})
    .then(jobs => {
      res.render('index', {
        jobs
      })
    })
    .catch(err => console.log(err))
  } else {
    Job.findAll({
      where: {title: {[Op.like]: query}},
      order: [
      ['createdAt', 'DESC']
    ]})
    .then(jobs => {
      res.render('index', {
        jobs, search
      })
    })
    .catch(err => console.log(err))
  }

 
})

// Jobs routes
app.use('/jobs', require('./routes/jobs'))