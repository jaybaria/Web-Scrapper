import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

export async function connectToDatabase(): Promise<Db> {
  try {
    const uri = process.env.MONGO_DB_CONNECTION;
    if (!uri) {
      throw new Error("MONGO_DB_CONNECTION environment variable is not set");
    }
    const client = await MongoClient.connect(uri);
    console.log("Successfully connected to MongoDB");
    return client.db();
  } catch (error) {
    console.log("Got Error While Initializing DB", error);
    throw error;
  }
}
