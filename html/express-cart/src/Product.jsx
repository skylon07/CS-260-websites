import './Product.css'

export default function Product({product}) {
    return <div className="Product">
        {product.name}, {product.price}
    </div>
}
