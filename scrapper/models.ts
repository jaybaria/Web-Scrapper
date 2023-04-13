import { Db, ObjectId, WithId } from "mongodb";
import connectToDatabase from "./db_connection";
import { Document } from "bson";

export interface ProductInfo {
  product_name: string;
  image_links: string[];
  brand_name: string;
  product_price: number;
  quantity: string;
  ingredients: string[];
  nutritions: string[];
  veg_non_veg: string;
}

export async function insertProductInfo(productInfo: ProductInfo[]) {
  const db: Db = await connectToDatabase();
  try {
    const collection = db.collection("products");
    let upsertedCount = 0;
    let modifiedCount = 0;
    const timestamp = new Date();
    const usedIds = new Set<number>();
    for (const product of productInfo) {
      let id = 1;
      while (usedIds.has(id)) {
        id++;
      }
      usedIds.add(id);
      const filter = { product_name: product.product_name };
      const options = { upsert: true };
      const update = {
        $setOnInsert: { created_at: timestamp },
        $set: { updated_at: timestamp, ...product, id },
      };
      const { modifiedCount: mc, upsertedCount: uc } =
        await collection.updateMany(filter, update, options);
      modifiedCount += mc;
      upsertedCount += uc;
    }
    console.log(
      `${upsertedCount} Documents Updated And ${modifiedCount} Documents Modified`
    );
  } catch (err) {
    console.error(`Got Error While Inserting Documents: ${err}`);
  }
}

export async function getAllProducts(): Promise<ProductInfo[]> {
  try {
    const db: Db = await connectToDatabase();
    const collection = db.collection("products");
    const productsInDb: WithId<Document>[] = await collection.find().toArray();
    const products: ProductInfo[] = productsInDb.map(
      (product: WithId<Document>) => {
        const { _id, ...rest } = product;
        return { id: String(rest.id), ...rest } as unknown as ProductInfo;
      }
    );
    return products;
  } catch (err) {
    console.error(`Got Error While Getting All Documents: ${err}`);
    throw err;
  }
}

export async function getProductById(id: number): Promise<ProductInfo | null> {
  try {
    const db: Db = await connectToDatabase();
    const collection = db.collection<ProductInfo>("products");

    const product: ProductInfo | null = await collection.findOne({ id });

    return product;
  } catch (err) {
    console.error(`Got Error While Getting Document By ID: ${err}`);
    throw err;
  }
}
