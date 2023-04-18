"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductByID = exports.readAllProducts = exports.scrapeProductDetails = void 0;
const validation_1 = require("./validation");
const puppeteer_1 = require("./puppeteer");
const models_1 = require("./models");
const response_1 = require("../utils/response");
async function scrapeProductDetails(req, res) {
    try {
        const { error, value } = validation_1.input_schema.validate(req.body);
        if (error) {
            return res.status(400).json(error.details[0].message);
        }
        const products = await (0, puppeteer_1.puppeteerScrapper)(value.website_link);
        if (!products) {
            return res.status(400).json("Unable to Scrape Data");
        }
        await (0, models_1.insertProductInfo)(products.productInfo);
        return (0, response_1.sendSuccess)(200, res, products.productInfo);
    }
    catch (error) {
        console.error(`Got Error Inserting Product Details: ${error}`);
        res.status(500).json({ error: "Something went wrong!" });
    }
}
exports.scrapeProductDetails = scrapeProductDetails;
async function readAllProducts(req, res) {
    try {
        const products = await (0, models_1.getAllProducts)();
        return (0, response_1.sendSuccess)(200, res, products);
    }
    catch (error) {
        console.error(`Got Error While Reading All Products: ${error}`);
        res.status(500).json({ error: "Something went wrong!" });
    }
}
exports.readAllProducts = readAllProducts;
async function getProductByID(req, res) {
    try {
        const { error } = validation_1.number_validation.validate(req.params);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const id = parseInt(req.params.id);
        const product = await (0, models_1.getProductById)(id);
        if (!product) {
            return res.status(400).send("Unable to Find Product");
        }
        return res.status(200).json(product);
    }
    catch (error) {
        console.error(`Error fetching product: ${error}`);
        return res.status(500).send("Internal server error");
    }
}
exports.getProductByID = getProductByID;
// export async function jsdomdatascraper(websiteLink: string) {
//   try {
//     const resp = await axios.default.get(websiteLink);
//     const dom = new jsdom.JSDOM(resp.data);
//     // Get the product card containers
//     const productCardContainers = dom.window.document.querySelectorAll(
//       ".plp-card-container"
//     );
//     // Loop through each product card container and extract the details
//     const products: { name: string; price: string; image: any }[] = [];
//     productCardContainers.forEach((productCardContainer) => {
//       // Get the product name
//       const productNameElement = productCardContainer.querySelector(
//         ".plp-card-details-name"
//       );
//       const productName = productNameElement?.textContent?.trim() ?? "";
//       // Get the product price
//       const productPriceElement = productCardContainer.querySelector(
//         ".plp-card-details-price"
//       );
//       const Price = productPriceElement?.textContent?.trim() ?? "";
//       // Get the product image URL
//       const productImageElement = productCardContainer.querySelector(
//         ".plp-card-image > img"
//       ) as HTMLImageElement;
//       const productImageUrl = productImageElement
//         ? productImageElement.src
//         : "";
//       // Create a product object with the extracted details
//       const product = {
//         name: productName,
//         price: Price,
//         image: productImageUrl,
//       };
//       // Add the product object to the products array
//       products.push(product);
//     });
//     return {
//       response: products,
//     };
//   } catch (error) {
//     throw new Error("Error scraping website");
//   }
// }
