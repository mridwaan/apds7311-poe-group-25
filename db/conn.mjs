import { MongoClient } from "mongodb"; // Ensure MongoDB package is installed
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const connectionString = process.env.ATLAS_URI || ""; // Ensure ATLAS_URI is defined in your .env
console.log(connectionString); // Log for debugging

const client = new MongoClient(connectionString); // Create a new MongoClient instance
let conn;

try {
    conn = await client.connect(); // Connect to the database
    console.log("MongoDB is CONNECTED!!! :)");
} catch (e) {
    console.error("Connection error:", e); // Improved error logging
}

// Accessing the database
const db = client.db("users"); // Specify your database name

// Exporting the database object
export default db;
