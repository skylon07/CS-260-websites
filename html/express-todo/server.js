// a lot of this was copy-pasted and only
// somewhat modified; if it's crappy looking
// code, it's not my fault lol

const express = require('express')
const bodyParser = require('body-parser')
const { argv } = require('process')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*")
    response.header("Access-Control-Allow-Methods", "POST, GET, DELETE")
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})
app.use(express.static('public'))

const items = []
let id = 0

app.get('/api/todo', (request, response) => {
    response.send(items)
})
app.post('/api/todo', (request, response) => {
    id += 1
    const item = {
        id: id,
        task: request.body.task,
        completed: request.body.completed
    }
    items.push(item)
    response.send(item)
})
app.put('/api/todo/:id', (request, response) => {
    const id = parseInt(request.params.id)
    const index = items.map(item => {
        return item.id
    }).indexOf(id);
    if (index === -1) {
        response.status(404)
            .send("Sorry, that item doesn't exist")
        return
    }
    const item = items[index]
    item.task = request.body.task
    item.completed = request.body.completed
    response.send(item)
});
app.delete('/api/todo/:id', (request, response) => {
    const id = parseInt(request.params.id);
    const removeIndex = items.map(item => {
        return item.id;
    }).indexOf(id);
    if (removeIndex === -1) {
        response.status(404)
            .send("Sorry, that item doesn't exist");
        return;
    }
    items.splice(removeIndex, 1);
    response.sendStatus(200);
});

const portArg = parseInt(argv[2])
const portDefault = 3001
const port = portArg || portDefault
app.listen(port, () => console.log(`Server listening on port ${port}`))
