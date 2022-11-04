import React, { useState } from 'react'
import axios from 'axios'

import Product from './Product'
import CartItem from './CartItem'
import { useAsyncEffect } from './shared'

import './App.css'

export default function App() {
    // DEBUG
    const [products, forceUpdateProducts_DEBUG] = useFetchableProducts()
    const [cartItems, addProductToCart, changeQuantity, removeCartItem] = useFetchableCartItems()
    
    const productElems = products.map((product) => {
        return <React.Fragment key={product.id}>
            <Product
                product={product}
            />
            <button onClick={() => addProductToCart(product)}>
                Add to cart
            </button>
            <br />
            <br />
        </React.Fragment>
    })

    const cartElems = cartItems?.map((cartItem) => {
        const changeQuantity_forThisItem = (newQuantityFn) => changeQuantity(cartItem, newQuantityFn)
        const removeCartItem_forThisItem = () => removeCartItem(cartItem)
        return <CartItem
            key={cartItem.productId}
            cartItem={cartItem}
            onChangeQuantity={changeQuantity_forThisItem}
            onRemove={removeCartItem_forThisItem}
        />
    })

    // DEBUG
    const [axiosBaseUrl, _setAxiosBaseUrl] = useState("http://thedelta.stream:27633")
    const setAxiosBaseUrl = (event) => {
        const newBaseUrl = event.target.value
        _setAxiosBaseUrl(newBaseUrl)
        axios.defaults.baseURL = newBaseUrl
        console.log("Axios base url updated:", newBaseUrl)
    }

    return (
        <div className="App">
            {/* // DEBUG */}
            <input
                value={axiosBaseUrl}
                onChange={setAxiosBaseUrl}
            />
            <button onClick={forceUpdateProducts_DEBUG}>Force update products</button>

            <h1>Products</h1>
            {productElems}
            <h1>Cart</h1>
            {cartElems}
        </div>
    )
}

function useFetchableProducts() {
    const [products, setProducts] = useState([])

    // DEBUG
    const [forceUpdateCounter_DEBUG, setForceUpdateCounter_DEBUG] = useState(0)
    
    useAsyncEffect(async () => {
        // DEBUG
        console.log("Updating products...")
        const response = await axios.get(`/express-cart-api/products`)
        const products = response.data
        setProducts(products)
    }, [forceUpdateCounter_DEBUG])

    // DEBUG
    const forceUpdateProducts_DEBUG = () => {
        setForceUpdateCounter_DEBUG((last) => last + 1)
    }
    return [products, forceUpdateProducts_DEBUG]
}

function useFetchableCartItems() {
    const [pushCount, setPushCount] = useState(0)
    const incrememtPushCount = () => setPushCount((pushCount) => pushCount + 1)
    
    const [cartItems, setCartItems] = useState([])

    useAsyncEffect(async () => {
        const response = await axios.get(`/express-cart-api/cart`)
        const cartItems = response.data
        setCartItems(cartItems)
    }, [pushCount])

    const addProductToCart = async (product) => {
        await axios.post(`/express-cart-api/cart/${product.id}`)
        incrememtPushCount()
    }

    const changeQuantity = async (cartItem, newQuantityFn) => {
        const newQuantity = newQuantityFn(cartItem.quantity)
        await axios.put(`/express-cart-api/cart/${cartItem.productId}/${newQuantity}`)
        incrememtPushCount()
    }

    const removeCartItem = async (cartItem) => {
        await axios.delete(`/express-cart-api/cart/${cartItem.productId}`)
        incrememtPushCount()
    }

    return [cartItems, addProductToCart, changeQuantity, removeCartItem]
}
