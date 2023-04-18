"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductById = exports.getAllProducts = exports.insertProductInfo = void 0;
const __1 = require("..");
async function insertProductInfo(productInfo) {
    try {
        const collection = __1.db.collection("products");
        const timestamp = new Date();
        // Fetch all existing products from the database and create a map using product name and price as the key,
        // so that it can be used to check if a product with the same name and price already exists in the database.
        // This will help in preventing insertion of duplicate records.
        const existing_products = await collection.find({}).toArray();
        const existing_product_map = new Map();
        existing_products.forEach((product) => {
            existing_product_map.set(`${product.product_name}-${product.product_price}`, product);
        });
        let highest_id = 0;
        existing_products.forEach((product) => {
            if (product.id > highest_id) {
                highest_id = product.id;
            }
        });
        let next_id = highest_id + 1;
        for (const product of productInfo) {
            const key = `${product.product_name}-${product.product_price}`;
            if (existing_product_map.has(key)) {
                // console.log(
                //   `Product with name ${product.product_name} and price ${product.product_price} already exists in database.`
                // );
                continue;
            }
            const new_product = {
                ...product,
                id: next_id,
                created_at: timestamp,
                updated_at: timestamp,
            };
            const inserted_records = await collection.insertOne(new_product);
            if (inserted_records.acknowledged) {
                if (inserted_records.insertedId) {
                    console.log(`Inserted 1 record with id ${next_id}`);
                    next_id++;
                }
                else {
                    console.log("No record inserted");
                }
            }
            else {
                console.log("Error inserting record");
            }
        }
    }
    catch (err) {
        console.error(`Got Error While Inserting Documents: ${err}`);
    }
}
exports.insertProductInfo = insertProductInfo;
async function getAllProducts() {
    try {
        const collection = __1.db.collection("products");
        const productsInDb = await collection.find().toArray();
        const products = productsInDb.map((product) => {
            const { _id, ...rest } = product;
            return { id: String(rest.id), ...rest };
        });
        return products;
    }
    catch (err) {
        console.error(`Got Error While Getting All Documents: ${err}`);
        throw err;
    }
}
exports.getAllProducts = getAllProducts;
async function getProductById(id) {
    try {
        const collection = __1.db.collection("products");
        const product = await collection.findOne({ id });
        return product;
    }
    catch (err) {
        console.error(`Got Error While Getting Document By ID: ${err}`);
        throw err;
    }
}
exports.getProductById = getProductById;
