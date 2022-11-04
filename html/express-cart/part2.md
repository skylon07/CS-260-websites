# Shopping cart on the back end

The back end should store shopping cart items in an array. Each item in the
array is an object, with the following properties:

- id: the identifier of a product
- quantity: the quantity of this product (an integer)

Implement the following API endpoints.

## Getting the shopping cart

Implement `GET /api/cart`. This should return an array of all the items in the
cart.

## Adding a product to the cart

Implement `POST /api/cart/:id`. This should add the product (from the products
array) with the identifier given by the `:id` parameter into the cart array.

If the product is already in the cart, instead of adding it twice, increase the
quantity of the item in the cart.

_Hint_: Note that the id of the item in the cart is the same as the id of the
product. But the items in the cart do _not_ have a name or price -- those are
listed in the products array. The items only have the id and quantity.

## Edit the quantity of an item in the cart

Implement `PUT /api/cart/:id/:quantity`. This should edit the item in the cart
whose identifier is given by the `:id` parameter and change its quantity to be
equal to the amount given by the `:quantity` parameter.

If the item is not in the cart, return a 404 error.

If the quantity is changed to zero, delete the item from the cart.

This method returns the item from the cart whose quantity is changed. If the
item's quantity is zero (and the item is deleted), it still returns the item,
showing a quantity of zero.

_Hint_: To find the product in the cart, you can use the higher-order
[find() function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find).

## Delete an item from the cart

Implement `DELETE /api/cart/:id`. This should delete the item in the cart whose
identifier is given by the `:id` parameter.

_Hint_: To delete an item, use the higher-order
[filter() function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter).

## Testing

We assume you have setup testing in [part 1](./part1.md). You can test each of
these functions by doing the following:

1. Download [src/cart.test.js](src/cart.test.js)

2. Run `npm run test`. You can also run `npx jest cart.test.js` to test just the
   cart functionality.

## Mock Data

When you feel your back end is completely tested, download these files:

- [products.js](./src/products.js)
- [add_products.js](./src/add_products.js)

Place them alongside your back end code. The `products.js` file contains some
mock data. The `add_products.js` script will call your API and add these mock
products to your server.

Run `node server.js` in one terminal, and then `node add_products.js` in
another. This should add all the products.

If you want to double-check that they were added, you can use:

```sh
curl localhost:3000/api/products
```
