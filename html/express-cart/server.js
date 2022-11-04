const express = require('express')
const bodyParser = require('body-parser')
const { argv } = require('process')
const axios = require('axios')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*")
    response.header("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE")
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})
app.use(express.static('public'))

class Database {
    constructor() {
        this._products = []
        this._cart = []

        setTimeout(() => this.initProducts(), 1000)
    }

    async initProducts() {
        const products = require("./server-resources/products")

        for (const product of products) {
            const response = await axios.post(`/api/products`, product)
            if (response.status !== 200) {
                console.log(`Error adding ${product.name}, code ${response.status}`)
            }
        }
    }

    getProducts() {
        return this._products
    }

    getProductById(productId) {
        const product = this._products.find((product) => product.id === productId)
        return product
    }

    addProduct(product) {
        console.assert(product instanceof Product)
        this._products.push(product)
    }

    deleteProduct(productId) {
        const productIdx = this._products.findIndex((product) => product.id === productId)
        const deletedProducts = this._products.splice(productIdx, 1)
        return deletedProducts[0]
    }

    getCart() {
        return this._cart
    }

    addProductToCart(productId) {
        let cartItem = this._cart.find((cartItem) => cartItem.productId === productId)
        const cartContainsProduct = cartItem !== undefined
        if (cartContainsProduct) {
            cartItem.quantity += 1
        } else {
            cartItem = new CartItem(productId)
            this._cart.push(cartItem)
        }
    }

    setQuantity(productId, newQuantity) {
        let cartItem = this._cart.find((cartItem) => cartItem.productId === productId)
        const cartContainsProduct = cartItem !== null
        if (cartContainsProduct) {
            cartItem.quantity = newQuantity
            if (newQuantity === 0) {
                this.removeProductFromCart(productId)
            }
        }
        return cartItem
    }

    removeProductFromCart(productId) {
        const productIdx = this._cart.findIndex((cartItem) => cartItem.productId === productId)
        const deletedCartItems = this._cart.splice(productIdx, 1)
        return deletedCartItems[0]
    }
}
const database = new Database()

class Product {
    static _productId = 0
    static _getUniqueProductId() {
        const id = Product._productId
        Product._productId += 1
        return id
    }

    constructor(name, price) {
        this.name = name
        this.price = price
        this.id = Product._getUniqueProductId()
    }
}

class CartItem {
    constructor(productId, quantity=1) {
        this.productId = productId
        this.quantity = quantity
    }
}

app.get('/api/products', (request, response) => {
    response.send(database.getProducts())
})
app.post('/api/products', (request, response) => {
    const newProduct = new Product(request.body.name, request.body.price)
    database.addProduct(newProduct)
    response.send(newProduct)
})

app.get('/api/products/:id', (request, response) => {
    const id = parseInt(request.params.id)
    const product = database.getProductById(id)
    response.send(product)
})
app.delete('/api/products/:id', (request, response) => {
    const id = parseInt(request.params.id);
    database.deleteProduct(id)
    response.sendStatus(200);
})

app.get('/api/cart', (request, response) => {
    response.send(database.getCart())
})

app.post('/api/cart/:id', (request, response) => {
    const id = parseInt(request.params.id)
    database.addProductToCart(id)
    response.sendStatus(200)
})
app.delete('/api/cart/:id', (request, response) => {
    const id = parseInt(request.params.id)
    database.removeProductFromCart(id)
    response.sendStatus(200)
})

app.put('/api/cart/:id/:quantity', (request, response) => {
    const id = parseInt(request.params.id)
    const quantity = parseInt(request.params.quantity)
    const cartItem = database.setQuantity(id, quantity)
    const productInCart = cartItem !== null
    if (productInCart) {
        response.send(cartItem)
    } else {
        response.status(404)
    }
})

const portArg = parseInt(argv[2])
const portDefault = 27634
const port = portArg || portDefault
app.listen(port, () => console.log(`Server listening on port ${port}`))

axios.defaults.baseURL = `http://localhost:${port}`
