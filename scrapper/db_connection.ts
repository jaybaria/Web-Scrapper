import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

async function connectToDatabase(): Promise<Db> {
  const uri = process.env.MONGO_DB_CONNECTION;
  if (!uri) {
    throw new Error("MONGO_DB_CONNECTION environment variable is not set");
  }
  const client = await MongoClient.connect(uri);
  console.log("Successfully connected to MongoDB");
  return client.db();
}

export default connectToDatabase;
