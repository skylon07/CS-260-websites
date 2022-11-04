import { useState } from 'react'
import axios from 'axios'

import { useAsyncEffect } from './shared'

import './CartItem.css'

export default function CartItem({cartItem, onChangeQuantity, onRemove}) {
    const product = useFetchableCartItemProduct(cartItem)
    const quantity = cartItem.quantity

    const incrementQuantity = () => onChangeQuantity((quantity) => quantity + 1)
    const decrementQuantity = () => onChangeQuantity((quantity) => quantity - 1)

    const removeFromCart = onRemove

    return <div className="CartItem">
        {product?.name}, {quantity}
        <button onClick={decrementQuantity}>-</button>
        <button onClick={incrementQuantity}>+</button>
        <button onClick={removeFromCart}>Remove from cart</button>
    </div>
}

function useFetchableCartItemProduct(cartItem) {
    const [product, setProduct] = useState(null)
    
    useAsyncEffect(async () => {
        const response = await axios.get(`/api/products/${cartItem.productId}`)
        const product = response.data
        setProduct(product)
    }, [])

    return product
}
