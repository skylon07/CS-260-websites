import React, { useState } from 'react'
import axios from 'axios'

import Product from './Product'
import CartItem from './CartItem'
import { baseUrl, useAsyncEffect } from './shared'

import './App.css'

export default function App() {
    const products = useFetchableProducts()
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

    return (
        <div className="App">
            <h1>Products</h1>
            {productElems}
            <h1>Cart</h1>
            {cartElems}
        </div>
    )
}

function useFetchableProducts() {
    const [products, setProducts] = useState([])
    
    useAsyncEffect(async () => {
        const response = await axios.get(`${baseUrl}/api/products`)
        const products = response.data
        setProducts(products)
    }, [])

    return products
}

function useFetchableCartItems() {
    const [pushCount, setPushCount] = useState(0)
    const incrememtPushCount = () => setPushCount((pushCount) => pushCount + 1)
    
    const [cartItems, setCartItems] = useState([])

    useAsyncEffect(async () => {
        const response = await axios.get(`${baseUrl}/api/cart`)
        const cartItems = response.data
        setCartItems(cartItems)
    }, [pushCount])

    const addProductToCart = async (product) => {
        await axios.post(`${baseUrl}/api/cart/${product.id}`)
        incrememtPushCount()
    }

    const changeQuantity = async (cartItem, newQuantityFn) => {
        const newQuantity = newQuantityFn(cartItem.quantity)
        await axios.put(`${baseUrl}/api/cart/${cartItem.productId}/${newQuantity}`)
        incrememtPushCount()
    }

    const removeCartItem = async (cartItem) => {
        await axios.delete(`${baseUrl}/api/cart/${cartItem.productId}`)
        incrememtPushCount()
    }

    return [cartItems, addProductToCart, changeQuantity, removeCartItem]
}
