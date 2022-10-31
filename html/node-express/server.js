const express = require('express')
const bodyParser = require('body-parser')
const { argv } = require('process')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*")
    response.header("Access-Control-Allow-Methods", "POST, GET, DELETE")
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})
app.use(express.static('public'))

const database = {
    tickets: [],
    id: 0,
}

app.get('/api/tickets', (request, response) => {
    console.log("Getting tickets")
    response.send(database.tickets)
})
app.post('/api/tickets', (request, response) => {
    database.id += 1
    const {id} = database
    const {name, problem} = request.body
    const ticket = {id, name, problem}
    console.log(`Adding ticket ${ticket.id}`)
    database.tickets.push(ticket)
    response.send(ticket)
})

app.delete('/api/tickets/:id', (request, response) => {
    const id = parseInt(request.params.id)
    const removeIdx = database.tickets.map((ticket) => ticket.id).indexOf(id)
    if (removeIdx === -1) {
        response.status(404).send("Ticket does not exist")
    } else {
        console.log(`Removing ticket ${request.params.id}`)
        database.tickets.splice(removeIdx, 1)
        response.sendStatus(200)
    }
})

const portArg = parseInt(argv[2])
const portDefault = 3001
const port = portArg || portDefault
app.listen(port, () => console.log(`Server listening on port ${port}`))
