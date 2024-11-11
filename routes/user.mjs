import express from "express";
import db from "../db/conn.mjs"; // Fixed import path
import { ObjectId } from "mongodb"; // Changed to 'ObjectId' with the correct casing
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ExpressBrute from "express-brute";

const router = express.Router(); // Fixed the Router method

const store = new ExpressBrute.MemoryStore();
const bruteforce = new ExpressBrute(store);

// Sign up
router.post("/signup", async (req, res) => { // Fixed the method name and syntax
    try {
        const { name, password } = req.body; // Destructure the request body
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

        // Create a new user object
        const newUser = {
            name: name,
            password: hashedPassword // Store the hashed password
        };

        // Insert the new user into the database
        const collection = await db.collection("users");
        const result = await collection.insertOne(newUser); // Insert the new user
        res.status(201).json({ message: "User created successfully", userId: result.insertedId }); // Send success response with user ID
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Signup failed" }); // Fixed response method
    }
});

// Login
router.post("/login", bruteforce.prevent, async (req, res) => { // Fixed the method name and syntax
    const { name, password } = req.body; // Destructure the request body

    try {
        const collection = await db.collection("users");
        const user = await collection.findOne({ name }); // Find the user by name

        if (!user) { // Check if the user exists
            return res.status(401).json({ message: "Authentication failed" }); // Respond with error if user not found
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password); // Compare passwords

        if (!passwordMatch) { // Check if passwords match
            return res.status(401).json({ message: "Authentication failed" }); // Respond with error if passwords do not match
        }

        // Authentication successful, create a token
        const token = jwt.sign(
            { username: user.name }, // Include the user's name in the token payload
            process.env.JWT_SECRET || "this_secret_should_be_longer_than_it_is", // Use environment variable for secret
            { expiresIn: "1h" } // Set token expiration
        );

        res.status(200).json({ message: "Authentication successful", token: token, name: user.name }); // Respond with success
        console.log("Your new token is", token);
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed" }); // Respond with error if login fails
    }
});

export default router; // Ensure export statement is at the end
