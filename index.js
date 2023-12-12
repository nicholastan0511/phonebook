const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

app.use(morgan(function (tokens, req, res) {
  console.log(req.body, typeof req.body)
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))

const generateId = () => {
  return Math.floor(Math.random() * (10000 - 1 + 1 ) + 1)
}

const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError')
    return res.status(400).json({ error: error.message })

  next(error)
} 

let persons = [
    // { 
    //     "id": 1,
    //     "name": "Arto Hellas", 
    //     "number": "040-123456"
    // },
    // { 
    //     "id": 2,
    //     "name": "Ada Lovelace", 
    //     "number": "39-44-5323523"
    // },
    // { 
    //     "id": 3,
    //     "name": "Dan Abramov", 
    //     "number": "12-43-234345"
    // },
    // { 
    //     "id": 4,
    //     "name": "Mary Poppendieck", 
    //     "number": "39-23-6423122"
    // }  
]

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons)
    })
})

app.get('/info', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.send(
        `<p>Phonebook has info for ${persons.length} people</p>
         <br />
         <p>${new Date().toLocaleString()}</p>
        `)
    })
 
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      res.json(person)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndDelete(req.params.id)
    .then(deleted => {
      console.log(deleted)
      res.status(204).end()
    })
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  if (!body.name) {
    return res.status(400).json({
      error: 'name missing'
    })
  } else if (!body.number) {
    return res.status(400).json({
      error: 'number missing'
    })
  } else if (persons.find(p => p.name.toUpperCase() == body.name.toUpperCase())) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = new Person ({
    name: body.name,
    number: body.number,
    id: generateId(),
  })

  person
    .save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person
    .findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))

})


app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})