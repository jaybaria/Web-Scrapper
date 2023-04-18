"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function connectToDatabase() {
    try {
        const uri = process.env.MONGO_DB_CONNECTION;
        if (!uri) {
            throw new Error("MONGO_DB_CONNECTION environment variable is not set");
        }
        const client = await mongodb_1.MongoClient.connect(uri);
        console.log("Successfully connected to MongoDB");
        return client.db();
    }
    catch (error) {
        console.log("Got Error While Initializing DB", error);
        throw error;
    }
}
exports.connectToDatabase = connectToDatabase;
