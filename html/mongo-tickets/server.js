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

const mongoose = require('mongoose')
mongoose.connect(
    "mongodb+srv://skylon07:P34chp13@free-cluster-yay.taxigfe.mongodb.net/mongo-tickets?retryWrites=true&w=majority",
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    },
)

const ticketSchema = new mongoose.Schema({
    name: String,
    problem: String,
})
ticketSchema.virtual('id').get(function() { return this._id.toHexString() })
ticketSchema.set('toObject', { virtuals: true })
ticketSchema.set('toJSON', { virtuals: true })
const Ticket = mongoose.model('Ticket', ticketSchema)

app.get('/api/tickets', async (request, response) => {
    try {
        console.log("Getting tickets")
        const tickets = await Ticket.find()
        response.send(tickets)
    } catch (error) {
        console.error("Failed to get tickets", error)
        response.sendStatus(500)
    }
})
app.post('/api/tickets', async (request, response) => {
    try {
        const {name, problem} = request.body
        const ticket = new Ticket({name, problem})
        console.log(`Adding ticket ${ticket.id}`)
        await ticket.save()
        response.send(ticket)
    } catch (error) {
        console.error("Failed to post ticket", error)
        response.sendStatus(500)
    }
})

app.delete('/api/tickets/:id', async (request, response) => {
    try {
        console.log(`Removing ticket ${request.params.id}`)
        const idToDelete = request.params.id
        await Ticket.deleteOne({_id: idToDelete})
        response.sendStatus(200)
    } catch (error) {
        console.error("Failed to delete ticket", error)
        response.sendStatus(500)
    }
})

const portArg = parseInt(argv[2])
const portDefault = 3001
const port = portArg || portDefault
app.listen(port, () => console.log(`Server listening on port ${port}`))
