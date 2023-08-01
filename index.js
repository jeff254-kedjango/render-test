const express = require('express')
var morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] :response-time ms - :body'));
app.use(express.static('build'))


let date = new Date()

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

// app.get('/',(request, response) => {
//     response.send('<h1>Hello World!</h1>')
// })

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id )
    response.status(204).end()
})

const generateId =()=>{
    number = Number.MAX_VALUE;
    let id = Math.floor(Math.random() * number)

    return id
} 

app.post('/api/persons', (request, response) => {
    const body = request.body

    const finder = persons.find(person => person.name === body.name)

    if(!body.name){
        return response.status(400).json({
            error: 'name is missing'
        })
    }

    if(!body.number){
        return response.status(400).json({
            error: 'number is missing'
        })
    }

    if(finder){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    date = new Date()
    response.json(person)
})

app.get('/info', (request, response) => {
    response.send(`<div><h2>Phonebook has info for ${persons.length} people</h2><p>${date}</p></div>`)
})

const PORT = process.env.PORT || 3003
app.listen(PORT, ()=> {
    console.log(`running in port ${PORT}`)
})
