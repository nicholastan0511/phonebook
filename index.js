const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(cors())

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

let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }  
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p>
     <br />
     <p>${new Date().toLocaleString()}</p>
    `)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if (person)
    res.json(person)
  else 
    res.status(400).end('PERSON NOT FOUND')
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
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

  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }


  persons = persons.concat(newPerson)
  res.json(newPerson)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})