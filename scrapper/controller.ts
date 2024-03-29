import { Request, Response } from "express";
import { input_schema, number_validation } from "./validation";
import { puppeteerScrapper } from "./puppeteer";
import { getAllProducts, getProductById, insertProductInfo } from "./models";
import { sendError, sendSuccess } from "../utils/response";

export async function scrapeProductDetails(req: Request, res: Response) {
  try {
    const { error, value } = input_schema.validate(req.body);
    if (error) {
      return sendError(400, res, error.details[0].message);
    }

    const products = await puppeteerScrapper(value.website_link);
    if (!products) {
      return sendError(400, res, "Got Empty Response After Scraped Data");
    }

    await insertProductInfo(products.productInfo);

    return sendSuccess(200, res, products.productInfo);
  } catch (error) {
    console.error(`Got Error Inserting Product Details: ${error}`);
    return sendError(
      500,
      res,
      "Got Internal Server Error While Scrapping Data"
    );
  }
}

export async function readAllProducts(req: Request, res: Response) {
  try {
    const products = await getAllProducts();
    return sendSuccess(200, res, products);
  } catch (error) {
    console.error(`Got Error While Reading All Products: ${error}`);
    return sendError(
      500,
      res,
      "Got Internal Server Error While Fetching All Products"
    );
  }
}

export async function getProductByID(req: Request, res: Response) {
  try {
    const { error } = number_validation.validate(req.params);
    if (error) {
      return sendError(400, res, error.details[0].message);
    }
    const id = parseInt(req.params.id);
    const product = await getProductById(id);
    if (!product) {
      return sendError(400, res, "Product not found");
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error(`Error fetching product: ${error}`);
    return sendError(
      500,
      res,
      "Got Internal server error while Fetching Product By Id"
    );
  }
}

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
