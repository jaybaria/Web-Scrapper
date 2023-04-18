"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
router.post("/api/products", controller_1.scrapeProductDetails);
router.get("/api/products/all", controller_1.readAllProducts);
router.get("/api/products/:id", controller_1.getProductByID);
/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API's for retrieving food product information
 */
/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new food product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               website_link:
 *                 type: string
 *                 example: "https://www.flipkart.com/search?q=Pasta&otracker=search&otracker1=search&marketplace=GROCERY&as-show=on&as=off"
 *     responses:
 *       201:
 *         description: Successfully Fetched Data.
 *       400:
 *         description: Bad request. The request body is invalid.
 *       404:
 *         description: Resource not found. The requested resource does not exist.
 *       500:
 *         description: Internal server error. An unexpected error occurred while processing the request.
 */
/**
 * @swagger
 * /api/products/all:
 *   get:
 *     summary: get all food product
 *     tags: [Products]
 *     responses:
 *       201:
 *         description: Successfully Fetched all products.
 *       400:
 *         description: Bad request. The request body is invalid.
 *       404:
 *         description: Resource not found. The requested resource does not exist.
 *       500:
 *         description: Internal server error. An unexpected error occurred while processing the request.
 */
/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get food product By ID
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the product to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Successfully Fetched Data.
 *       400:
 *         description: Bad request. The request body is invalid.
 *       404:
 *         description: Resource not found. The requested resource does not exist.
 *       500:
 *         description: Internal server error. An unexpected error occurred while processing the request.
 */
exports.default = router;
