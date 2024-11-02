[NODEJS__BADGE]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[TYPESCRIPT__BADGE]: https://img.shields.io/badge/typescript-D4FAFF?style=for-the-badge&logo=typescript
[EXPRESS__BADGE]: https://img.shields.io/badge/express-005CFE?style=for-the-badge&logo=express
[MONGO_BADGE]: https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white

<h1 align="center" style="font-weight: bold;">CandyCostManager 💻</h1>

![nodejs][NODEJS__BADGE]
![typescript][TYPESCRIPT__BADGE]
![express][EXPRESS__BADGE]
![mongo][MONGO_BADGE]

<p align="center">
 <a href="#started">Getting Started</a> • 
  <a href="#routes">API Endpoints</a> •
 <a href="#colab">Collaborators</a> •
 <a href="#contribute">Contribute</a>
</p>

<p align="center">
  <b>This is a personal project that I am developing for my wife, who owns a small bakery and works only to order. It's an API for registering components and products it manufactures. It calculates the cost of a given recipe (cake, dessert, sweet, etc.) based on the components and their respective quantities used in preparation.</b>
</p>

<h2 id="started">🚀 Getting started</h2>

See below for instructions on how to run this project locally.

<h3>Prerequisites</h3>

Prerequisites required to execute the project:

- [NodeJS](https://nodejs.org/en)
- [TypeScript](https://www.typescriptlang.org/)
- [Git 2](https://git-scm.com/)

<h3>Cloning</h3>

How to clone this project

```bash
git clone https://github.com/emersonbbezerra/candyCostManager.git
```

<h3> Environment Variables</h2>

Use the code below as a reference to create your `.env` configuration file by adding your MongoDB URL.

```yaml
DATABASE_URL=add_your_mongodb_connection_string_here
```

<h3>Installing</h3>

How to install the dependencies of this project.

```bash
cd candyCostManager
npm install
```

<h3>Starting</h3>

How to start.

```bash
npm run dev
```

The api will start on port 3000.

<h2 id="routes">📍 API Endpoints</h2>

This api covers two route branches: `/components` and `/products`

<h3 id="ingredients_routes">Ingredients Routes</h3>

​
| route | description  
|----------------------|-----------------------------------------------------
| <kbd>POST /components</kbd> | register an component in the database [post details](#post-component)
| <kbd>GET /components/search</kbd> | find registered components by name [response details](#get-components-search)
| <kbd>GET /components</kbd> | list registered components [response details](#get-components)
| <kbd>GET /components/:id</kbd> | returns the component by id [response details](#get-component-id)
| <kbd>PUT /components/:id</kbd> | update the component by id [put details](#put-component)
| <kbd>DELETE /components/:id</kbd> | delete the component by id [response details](#delete-component)

<h3 id="post-component">POST /components</h3>

**REQUEST**

```json
{
  "name": "Chocolate Em Pó",
  "manufacturer": "Nestlé",
  "price": 20,
  "packageQuantity": 1000,
  "unitOfMeasure": "G",
  "category": "Chocolate"
}
```

**RESPONSE**

```
201 Created
```

```
Component created
```

If there is already an component registered with the same name and the same manufacturer in the database, the API will return the error:

```
409 Conflict
```

```json
{
  "message": "Component with this name and manufacturer already exists"
}
```

<h3 id="get-components-search">GET /components/search</h3>
The search takes place by sending, via "query", the name of the component or part of it.

Example: /components/search?name=leite

**RESPONSE**

```
200 Ok
```

```json
[
  {
    "id": "672576ea2d219d6c0944c3e8",
    "name": "Leite Condensado",
    "manufacturer": "Nestlé",
    "price": 5.7,
    "packageQuantity": 395,
    "unitOfMeasure": "Gramas",
    "category": "Laticínios",
    "createdAt": "2024-11-02T00:48:42.569Z",
    "updatedAt": "2024-11-02T01:31:35.100Z"
  },
  {
    "id": "672576f42d219d6c0944c3eb",
    "name": "Creme De Leite",
    "manufacturer": "Nestlé",
    "price": 3.5,
    "packageQuantity": 200,
    "unitOfMeasure": "Gramas",
    "category": "Laticínios",
    "createdAt": "2024-11-02T00:48:52.417Z",
    "updatedAt": "2024-11-02T00:48:52.417Z"
  },
  {
    "id": "672577272d219d6c0944c3fa",
    "name": "Leite",
    "manufacturer": "Itambé",
    "price": 4,
    "packageQuantity": 1000,
    "unitOfMeasure": "Mililitros",
    "category": "Laticínios",
    "createdAt": "2024-11-02T00:49:43.573Z",
    "updatedAt": "2024-11-02T00:49:43.573Z"
  }
]
```

<h3 id="get-components">GET /components</h3>

**RESPONSE**

```
200 Ok
```

```json
[
  {
    "id": "672576ea2d219d6c0944c3e8",
    "name": "Leite Condensado",
    "manufacturer": "Nestlé",
    "price": 5.7,
    "packageQuantity": 395,
    "unitOfMeasure": "Gramas",
    "category": "Laticínios",
    "createdAt": "2024-11-02T00:48:42.569Z",
    "updatedAt": "2024-11-02T01:31:35.100Z"
  },
  {
    "id": "672576f42d219d6c0944c3eb",
    "name": "Creme De Leite",
    "manufacturer": "Nestlé",
    "price": 3.5,
    "packageQuantity": 200,
    "unitOfMeasure": "Gramas",
    "category": "Laticínios",
    "createdAt": "2024-11-02T00:48:52.417Z",
    "updatedAt": "2024-11-02T00:48:52.417Z"
  },
  {
    "id": "672577062d219d6c0944c3ee",
    "name": "Cacau Em Pó",
    "manufacturer": "Garoto",
    "price": 29.9,
    "packageQuantity": 500,
    "unitOfMeasure": "Gramas",
    "category": "Doces",
    "createdAt": "2024-11-02T00:49:10.513Z",
    "updatedAt": "2024-11-02T00:49:10.514Z"
  },
  {
    "id": "6725770e2d219d6c0944c3f1",
    "name": "Margarina",
    "manufacturer": "Qualy",
    "price": 6,
    "packageQuantity": 500,
    "unitOfMeasure": "Gramas",
    "category": "Laticínios",
    "createdAt": "2024-11-02T00:49:18.322Z",
    "updatedAt": "2024-11-02T00:49:18.322Z"
  },
  {
    "id": "672577162d219d6c0944c3f4",
    "name": "Trigo",
    "manufacturer": "Bunge",
    "price": 5,
    "packageQuantity": 1000,
    "unitOfMeasure": "Gramas",
    "category": "Grãos",
    "createdAt": "2024-11-02T00:49:26.466Z",
    "updatedAt": "2024-11-02T00:49:26.466Z"
  },
  {
    "id": "6725771e2d219d6c0944c3f7",
    "name": "Açúcar",
    "manufacturer": "União",
    "price": 3,
    "packageQuantity": 1000,
    "unitOfMeasure": "Gramas",
    "category": "Doces",
    "createdAt": "2024-11-02T00:49:34.994Z",
    "updatedAt": "2024-11-02T00:49:34.994Z"
  },
  {
    "id": "672577272d219d6c0944c3fa",
    "name": "Leite",
    "manufacturer": "Itambé",
    "price": 4,
    "packageQuantity": 1000,
    "unitOfMeasure": "Mililitros",
    "category": "Laticínios",
    "createdAt": "2024-11-02T00:49:43.573Z",
    "updatedAt": "2024-11-02T00:49:43.573Z"
  },
  {
    "id": "6725772f2d219d6c0944c3fd",
    "name": "Ovos",
    "manufacturer": "Granja Sa",
    "price": 12,
    "packageQuantity": 30,
    "unitOfMeasure": "Unidades",
    "category": "Perecíveis",
    "createdAt": "2024-11-02T00:49:51.406Z",
    "updatedAt": "2024-11-02T00:49:51.406Z"
  },
  {
    "id": "672577372d219d6c0944c400",
    "name": "Farinha De Trigo",
    "manufacturer": "Dona Benta",
    "price": 5,
    "packageQuantity": 1000,
    "unitOfMeasure": "Gramas",
    "category": "Grãos",
    "createdAt": "2024-11-02T00:49:59.368Z",
    "updatedAt": "2024-11-02T00:49:59.368Z"
  },
  {
    "id": "6725773f2d219d6c0944c403",
    "name": "Fermento Em Pó",
    "manufacturer": "Royal",
    "price": 2.5,
    "packageQuantity": 100,
    "unitOfMeasure": "Gramas",
    "category": "Ingredientes De Panificação",
    "createdAt": "2024-11-02T00:50:07.289Z",
    "updatedAt": "2024-11-02T00:50:07.289Z"
  },
  {
    "id": "672577462d219d6c0944c406",
    "name": "Chocolate Em Pó",
    "manufacturer": "Nestlé",
    "price": 20,
    "packageQuantity": 1000,
    "unitOfMeasure": "G",
    "category": "Chocolate",
    "createdAt": "2024-11-02T00:50:14.843Z",
    "updatedAt": "2024-11-02T00:50:14.843Z"
  }
]
```

<h3 id="get-component-id">GET /components/672576ea2d219d6c0944c3e8</h3>

**RESPONSE**

```
200 Ok
```

```json
{
  "id": "672576ea2d219d6c0944c3e8",
  "name": "Leite Condensado",
  "manufacturer": "Nestlé",
  "price": 5.7,
  "packageQuantity": 395,
  "unitOfMeasure": "Gramas",
  "category": "Laticínios",
  "createdAt": "2024-11-02T00:48:42.569Z",
  "updatedAt": "2024-11-02T01:31:35.100Z"
}
```

If the component with the specified ID is not found, the API will return the error:

```
404 Not Found
```

```json
{
  "message": "Component not found"
}
```

<h3 id="put-component">PUT /components/672576ea2d219d6c0944c3e8</h3>

**REQUEST**

You can update the following data in an component: `name`, `manufacturer`, `price`, `packageQuantity`, `unitOfMeasure` and `category`.
It's possible to update just one piece of data at a time or all of the data for an component.

```json
{
  "price": 6
}
```

Or

```json
{
  "unitOfMeasure": "lbs"
}
```

**RESPONSE**

```
200 Ok
```

```json
{
  "message": "Component updated",
  "component": {
    "id": "672576ea2d219d6c0944c3e8",
    "name": "Leite Condensado",
    "manufacturer": "Nestlé",
    "price": 6,
    "packageQuantity": 395,
    "unitOfMeasure": "Lbs",
    "category": "Laticínios",
    "createdAt": "2024-11-02T00:48:42.569Z",
    "updatedAt": "2024-11-02T01:52:23.863Z"
  }
}
```

If the component is not found, the API will return the error:

```
404 Not Found
```

```json
{
  "message": "Component not found"
}
```

If the name and manufacturer are updated and there is already a similar one in the database, the API will return the error:

```
409 Conflict
```

```json
{
  "message": "An component with this name and manufacturer already exists"
}
```

<h3 id="delete-component">DELETE /components/672576ea2d219d6c0944c3e8</h3>

**RESPONSE**

```
200 Ok
```

```json
{
  "message": "Component deleted"
}
```

If the component with the specified ID is not found, the API will return the error:

```
404 Not Found
```

```json
{
  "message": "Component not found"
}
```

<h3 id="products_routes">Products Routes</h3>

​
| route | description  
|----------------------|-----------------------------------------------------
| <kbd>POST /products</kbd> | register an product in the database [post details](#post-product)
| <kbd>GET /products/search</kbd> | find registered products by name [response details](#get-products-search)
| <kbd>GET /products</kbd> | list registered products [response details](#get-products)
| <kbd>GET /products/:id</kbd> | returns the product by id [response details](#get-product-id)
| <kbd>PUT /products/:id</kbd> | update the product by id [put details](#put-product)
| <kbd>DELETE /products/:id</kbd> | delete the product by id [response details](#delete-product)

<h3 id="post-product">POST /products</h3>

**REQUEST**

```json
{
  "name": "Bolo Simples",
  "description": "Bolo caseiro tradicional",
  "category": "Bolos",
  "components": [
    {
      "componentId": "672577372d219d6c0944c400",
      "quantity": 300
    },
    {
      "componentId": "6725771e2d219d6c0944c3f7",
      "quantity": 200
    },
    {
      "componentId": "6725772f2d219d6c0944c3fd",
      "quantity": 4
    },
    {
      "componentId": "672577272d219d6c0944c3fa",
      "quantity": 240
    },
    {
      "componentId": "6725770e2d219d6c0944c3f1",
      "quantity": 120
    },
    {
      "componentId": "6725773f2d219d6c0944c403",
      "quantity": 10
    }
  ],
  "yield": 1000,
  "unitOfMeasure": "Gramas",
  "salePrice": 35.0,
  "isIngredient": false
}
```

**RESPONSE**

```
201 Created
```

```json
{
  "message": "Product created successfully"
}
```

If there is already an product registered with the same name in the database, the API will return the error:

```
409 Conflict
```

```json
{
  "message": "Product with this name and category already exists"
}
```

<h3 id="get-products-search">GET /products/search</h3>
The search takes place by sending, via "query", the name of the product or part of it.

Example: /products/search?name=br

**RESPONSE**

```
200 Ok
```

```json
[
  {
    "id": "672579c804c707ff89461227",
    "name": "Brigadeiro",
    "description": "Brigadeiro Cremoso Para Recheio E Cobertura",
    "category": "Bolos",
    "components": [
      {
        "componentId": "672576ea2d219d6c0944c3e8",
        "componentName": "Leite Condensado",
        "quantity": 395
      },
      {
        "componentId": "672577462d219d6c0944c406",
        "componentName": "Chocolate Em Pó",
        "quantity": 100
      },
      {
        "componentId": "6725770e2d219d6c0944c3f1",
        "componentName": "Margarina",
        "quantity": 50
      }
    ],
    "productionCost": 8.6,
    "yield": 500,
    "unitOfMeasure": "Gramas",
    "productionCostRatio": 0.0172,
    "salePrice": 25,
    "createdAt": "2024-11-02T01:00:56.989Z",
    "updatedAt": "2024-11-02T01:52:24.090Z",
    "isIngredient": true
  },
  {
    "id": "672579f704c707ff89461254",
    "name": "Bolo De Chocolate Com Brigadeiro",
    "description": "Bolo De Chocolate Recheado E Coberto Com Brigadeiro",
    "category": "Bolos",
    "components": [
      {
        "componentId": "672577372d219d6c0944c400",
        "componentName": "Farinha De Trigo",
        "quantity": 300
      },
      {
        "componentId": "6725771e2d219d6c0944c3f7",
        "componentName": "Açúcar",
        "quantity": 200
      },
      {
        "componentId": "672577462d219d6c0944c406",
        "componentName": "Chocolate Em Pó",
        "quantity": 100
      },
      {
        "componentId": "6725772f2d219d6c0944c3fd",
        "componentName": "Ovos",
        "quantity": 4
      },
      {
        "componentId": "672577272d219d6c0944c3fa",
        "componentName": "Leite",
        "quantity": 240
      },
      {
        "componentId": "6725770e2d219d6c0944c3f1",
        "componentName": "Margarina",
        "quantity": 120
      },
      {
        "componentId": "6725773f2d219d6c0944c403",
        "componentName": "Fermento Em Pó",
        "quantity": 10
      },
      {
        "componentId": "672579c804c707ff89461227",
        "componentName": "Brigadeiro",
        "quantity": 400
      }
    ],
    "productionCost": 15.23,
    "yield": 1500,
    "unitOfMeasure": "Gramas",
    "productionCostRatio": 0.010153333333333334,
    "salePrice": 50,
    "createdAt": "2024-11-02T01:01:43.263Z",
    "updatedAt": "2024-11-02T01:52:24.188Z",
    "isIngredient": false
  }
]
```

<h3 id="get-products">GET /products</h3>

**RESPONSE**

```
200 Ok
```

```json
[
  {
    "id": "672579c804c707ff89461227",
    "name": "Brigadeiro",
    "description": "Brigadeiro Cremoso Para Recheio E Cobertura",
    "category": "Bolos",
    "components": [
      {
        "componentId": "672576ea2d219d6c0944c3e8",
        "componentName": "Leite Condensado",
        "quantity": 395
      },
      {
        "componentId": "672577462d219d6c0944c406",
        "componentName": "Chocolate Em Pó",
        "quantity": 100
      },
      {
        "componentId": "6725770e2d219d6c0944c3f1",
        "componentName": "Margarina",
        "quantity": 50
      }
    ],
    "productionCost": 8.6,
    "yield": 500,
    "unitOfMeasure": "Gramas",
    "productionCostRatio": 0.0172,
    "salePrice": 25,
    "createdAt": "2024-11-02T01:00:56.989Z",
    "updatedAt": "2024-11-02T01:52:24.090Z",
    "isIngredient": true
  },
  {
    "id": "672579da04c707ff8946123a",
    "name": "Bolo Simples",
    "description": "Bolo Caseiro Tradicional",
    "category": "Bolos",
    "components": [
      {
        "componentId": "672577372d219d6c0944c400",
        "componentName": "Farinha De Trigo",
        "quantity": 300
      },
      {
        "componentId": "6725771e2d219d6c0944c3f7",
        "componentName": "Açúcar",
        "quantity": 200
      },
      {
        "componentId": "6725772f2d219d6c0944c3fd",
        "componentName": "Ovos",
        "quantity": 4
      },
      {
        "componentId": "672577272d219d6c0944c3fa",
        "componentName": "Leite",
        "quantity": 240
      },
      {
        "componentId": "6725770e2d219d6c0944c3f1",
        "componentName": "Margarina",
        "quantity": 120
      },
      {
        "componentId": "6725773f2d219d6c0944c403",
        "componentName": "Fermento Em Pó",
        "quantity": 10
      }
    ],
    "productionCost": 6.35,
    "yield": 1000,
    "unitOfMeasure": "Gramas",
    "productionCostRatio": 0.00635,
    "salePrice": 35,
    "createdAt": "2024-11-02T01:01:14.999Z",
    "updatedAt": "2024-11-02T01:01:14.999Z",
    "isIngredient": false
  },
  {
    "id": "672579f704c707ff89461254",
    "name": "Bolo De Chocolate Com Brigadeiro",
    "description": "Bolo De Chocolate Recheado E Coberto Com Brigadeiro",
    "category": "Bolos",
    "components": [
      {
        "componentId": "672577372d219d6c0944c400",
        "componentName": "Farinha De Trigo",
        "quantity": 300
      },
      {
        "componentId": "6725771e2d219d6c0944c3f7",
        "componentName": "Açúcar",
        "quantity": 200
      },
      {
        "componentId": "672577462d219d6c0944c406",
        "componentName": "Chocolate Em Pó",
        "quantity": 100
      },
      {
        "componentId": "6725772f2d219d6c0944c3fd",
        "componentName": "Ovos",
        "quantity": 4
      },
      {
        "componentId": "672577272d219d6c0944c3fa",
        "componentName": "Leite",
        "quantity": 240
      },
      {
        "componentId": "6725770e2d219d6c0944c3f1",
        "componentName": "Margarina",
        "quantity": 120
      },
      {
        "componentId": "6725773f2d219d6c0944c403",
        "componentName": "Fermento Em Pó",
        "quantity": 10
      },
      {
        "componentId": "672579c804c707ff89461227",
        "componentName": "Brigadeiro",
        "quantity": 400
      }
    ],
    "productionCost": 15.23,
    "yield": 1500,
    "unitOfMeasure": "Gramas",
    "productionCostRatio": 0.010153333333333334,
    "salePrice": 50,
    "createdAt": "2024-11-02T01:01:43.263Z",
    "updatedAt": "2024-11-02T01:52:24.188Z",
    "isIngredient": false
  }
]
```

<h3 id="get-product-id">GET /products/672579c804c707ff89461227</h3>

**RESPONSE**

```
200 Ok
```

```json
{
  "id": "672579c804c707ff89461227",
  "name": "Brigadeiro",
  "description": "Brigadeiro Cremoso Para Recheio E Cobertura",
  "category": "Bolos",
  "components": [
    {
      "componentId": "672576ea2d219d6c0944c3e8",
      "componentName": "Leite Condensado",
      "quantity": 395
    },
    {
      "componentId": "672577462d219d6c0944c406",
      "componentName": "Chocolate Em Pó",
      "quantity": 100
    },
    {
      "componentId": "6725770e2d219d6c0944c3f1",
      "componentName": "Margarina",
      "quantity": 50
    }
  ],
  "productionCost": 8.6,
  "yield": 500,
  "unitOfMeasure": "Gramas",
  "productionCostRatio": 0.0172,
  "salePrice": 25,
  "createdAt": "2024-11-02T01:00:56.989Z",
  "updatedAt": "2024-11-02T01:52:24.090Z",
  "isIngredient": true
}
```

If the product with the specified ID is not found, the API will return the error:

```
404 Not Found
```

```json
{
  "message": "Product not found"
}
```

<h3 id="put-product">PUT /products/672579c804c707ff89461227</h3>

**REQUEST**

You can update the following data in an product: `name`, `description`, `category`, `components`, `yield`, `unitOfMeasure`, `salePrice`, and `isIngredient`.
It's possible to update just one piece of data at a time or all of the data for an product.

```json
{
  "name": "Brigadeiro Gourmet"
}
```

Or

```json
{
  "components": [
    {
      "componentId": "672576ea2d219d6c0944c3e8",
      "quantity": 790
    },
    {
      "componentId": "672577462d219d6c0944c406",
      "quantity": 200
    },
    {
      "componentId": "6725770e2d219d6c0944c3f1",
      "quantity": 50
    }
  ]
}
```

**RESPONSE**

```
200 Ok
```

```json
{
  "message": "Product updated",
  "product": {
    "id": "672579c804c707ff89461227",
    "name": "Brigadeiro Gourmet",
    "description": "Brigadeiro Cremoso Para Recheio E Cobertura",
    "category": "Bolos",
    "components": [
      {
        "componentId": "672576ea2d219d6c0944c3e8",
        "componentName": "Leite Condensado",
        "quantity": 790
      },
      {
        "componentId": "672577462d219d6c0944c406",
        "componentName": "Chocolate Em Pó",
        "quantity": 200
      },
      {
        "componentId": "6725770e2d219d6c0944c3f1",
        "componentName": "Margarina",
        "quantity": 50
      }
    ],
    "productionCost": 16.6,
    "yield": 500,
    "unitOfMeasure": "Gramas",
    "productionCostRatio": 0.0332,
    "salePrice": 25,
    "createdAt": "2024-11-02T01:00:56.989Z",
    "updatedAt": "2024-11-02T02:08:29.657Z",
    "isIngredient": true
  }
}
```

If the product is not found, the API will return the error:

```
404 Not Found
```

```json
{
  "message": "Product not found"
}
```

If the request is to update the name and/or category of the product, it cannot be the same as another previously registered product with the same name and category. If this occurs, the API will return the error:

```
409 Conflict
```

```json
{
  "message": "A product with this name and category already exists"
}
```

<h3 id="delete-product">DELETE /products/6643dfb05bdf22de8c852bcc</h3>

**RESPONSE**

```
200 Ok
```

```json
{
  "message": "Product deleted successfully"
}
```

If the product with the specified ID is not found, the API will return the error:

```
404 Not Found
```

```json
{
  "message": "Product not found"
}
```

<h2 id="colab">🤝 Collaborators</h2>

Be part of this project and appear here in the hall of fame!

<table>
  <tr>
    <td align="center">
      <a href="#">
        <img src="https://avatars.githubusercontent.com/u/120873878?v=4" width="100px;" alt="Emerson Bezerra"/><br>
        <sub>
          <b>Emerson Bezerra (Creator)</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="#">
        <img src="https://t.ctcdn.com.br/n7eZ74KAcU3iYwnQ89-ul9txVxc=/400x400/smart/filters:format(webp)/i490769.jpeg" width="100px;" alt="Elon Musk Picture"/><br>
        <sub>
          <b>Elon Musk</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="#">
        <img src="https://miro.medium.com/max/360/0*1SkS3mSorArvY9kS.jpg" width="100px;" alt="Foto do Steve Jobs"/><br>
        <sub>
          <b>Steve Jobs</b>
        </sub>
      </a>
    </td>
  </tr>
</table>

<h2 id="contribute">📫 Contribute</h2>

Thank you for considering contributing to CandyCostManager! To contribute, please follow these steps:

1. **Fork the repository**: Click on the 'Fork' button at the top right of this page to create a copy of the repository in your GitHub account.

2. **Clone the repository**: Clone your forked repository to your local machine using:

   ```bash
   git clone https://github.com/emersonbbezerra/candyCostManager.git
   ```

3. **Create a new branch**: Create a new branch for your feature or bugfix using:

   ```bash
   git checkout -b feature-or-bugfix-name
   ```

4. **Make your changes**: Make the necessary changes to the codebase.

5. **Commit your changes**: Commit your changes with a descriptive commit message using:

   ```bash
   git commit -m "Description of the feature or bugfix"
   ```

6. **Push your changes**: Push your changes to your forked repository using:

   ```bash
   git push origin feature-or-bugfix-name
   ```

7. **Create a Pull Request**: Open a Pull Request to merge your changes into the main repository. Make sure to include a detailed description of your changes.

<h3>Documentations that might help</h3>

[📝 How to create a Pull Request](https://www.atlassian.com/br/git/tutorials/making-a-pull-request)

[💾 Commit pattern](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/emersonbbezerra/candyCostManager?tab=MIT-1-ov-file#readme) file for details.
