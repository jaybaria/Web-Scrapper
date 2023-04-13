# Project Title

## Web-Scraping-API

### Project Description

**This project is a RESTful API that allows users to view and manage food product information. The API has the following features:**

- Create a new food product

- Retrieve all food products

- Retrieve a specific food product by ID

### Technologies Used

- Node.js

- Express.js

- MongoDB

- Swagger

### Getting Started

To get started with this project, follow the steps below:

- Clone the repository to your local machine.

- Run npm install to install all the necessary dependencies.

- Create a .env file in the root directory of the project and add the following environment variables:

```
- MONGODB_URI=<your_mongodb_uri>

- PORT=<port_number>
```

- Start the server by running npm start.

- Use any RESTful API client (e.g., Postman) to test the API endpoints.

### API Endpoints

**GET /api/products**

- Retrieves all food products in the database.

**GET /api/products/:id**

- Retrieves a specific food product by ID.

**POST /api/products**

- Insert Website link to Retrive Informations.

### **Request/Response Examples**

**Request:** - **GET /api/products**

**Response:**

```
[
 {

"id": "1",

"product_name": "Pizza",

"image_links": ["https://example.com/images/pizza.jpg"],

"brand_name": "Pizza Hut",

"product_price": 10.99,

"quantity": "Large",

"ingredients": ["Dough","Tomato Sauce","Mozzarella Cheese","Pepperoni"],

"nutritions": [

"Calories: 150",

"Fat: 5g",

"Sodium: 400mg",

"Protein: 8g"

],
"veg_non_veg": "Non-Veg"
 }
]
```

**GET /api/products/:id**

Response:

```
[
 {

"id": "1",

"product_name": "Pizza",

"image_links": [

"https://example.com/images/pizza.jpg"

"brand_name": "Pizza Hut",

"product_price": 10.99,

"quantity": "Large",

"ingredients": ["Dough","Tomato Sauce","Mozzarella Cheese","Pepperoni"],

"nutritions": [

"Calories: 150",

"Fat: 5g",

"Sodium: 400mg",

"Protein: 8g"

],

"veg_non_veg": "Non-Veg"

 }

]
```
