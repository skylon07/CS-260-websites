# Products on the back end

The back end should store all products in an array. Each item in the array is an
object, with the following properties:

- id: a unique identifier
- name: the name of the product
- price: the price of the product

All three of these are strings.

Implement the following API endpoints.

## Getting all products

Implement `GET /api/products`. This should return an array of all the products.

## Getting a specific product

Implement `GET /api/products/:id`. This should return a specific product, whose
identifier is given by the `:id` parameter. This endpoint returns the entire
product object.

_Hint_: To find a specific product, you can use the higher-order
[find() function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find).

## Creating a product

Implement `POST /api/products`. The body of this request contains:

- name: the name of the product
- price: the price of the product

This should create the product, add it to the array of products, and return the
object that represents the product.

_Hint_: To create a unique identifier for a product use:

```
const id = crypto.randomUUID();
```

## Deleting a product

Implement `DELETE /api/products/:id`. This should delete the product from the
products array whose identifier is given by the `:id` parameter.

_Hint_: To delete a product, use the higher-order
[filter() function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter).

## Testing

You can test each of these functions by doing the following:

1. Run `npm install jest`

2. Add the following to your `package.json`:

```js
  "scripts": {
    "test": "jest"
  }
```

3. Download [src/products.test.js](src/products.test.js)

4. Run `npm run test`. You can also run `npx jest products.test.js`.
