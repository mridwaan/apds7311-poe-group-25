import express from "express";
import db from "../db/conn.mjs"; // Fixed import path
import { ObjectId } from "mongodb"; // Corrected ObjectId casing
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ExpressBrute from "express-brute";

const router = express.Router(); // Fixed the Router method

var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);

// Sign up
router.post("/signup", async (req, res) => { // Fixed the method name and syntax
    const password = await bcrypt.hash(req.body.password, 10); // Fixed method and property access
    let newDocument = { // Changed to object literal syntax
        name: req.body.name,
        password: password.toString() // Corrected the method call
    };
    let collection = await db.collection("users");
    let result = await collection.insertOne(newDocument); // Fixed method name
    console.log(password);
    res.status(204).send(result); // Fixed the response method
});

// Login
router.post("/login", bruteforce.prevent, async (req, res) => { // Fixed the method name and syntax
    const { name, password } = req.body; // Fixed destructuring assignment
    console.log(name + " " + password);

    try {
        const collection = await db.collection("users");
        const user = await collection.findOne({ name }); // Fixed variable name and method call

        if (!user) { // Fixed condition
            return res.status(401).json({ message: "Authentication failed" }); // Fixed response method
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password); // Fixed property access

        if (!passwordMatch) { // Fixed condition
            return res.status(401).json({ message: "Authentication failed" }); // Fixed response method
        }

        // Authentication successful
        const token = jwt.sign({ username: req.body.username }, "this_secret_should_be_longer_than_it_is", { expiresIn: "1h" }); // Fixed method parameters
        res.status(200).json({ message: "Authentication successful", token: token, name: req.body.name }); // Fixed response method
        console.log("Your new token is", token);
    } catch (error) {
        console.error("Login error:", error); // Fixed error logging
        res.status(500).json({ message: "Login failed" }); // Fixed response method
    }
});

export default router; // Ensure export statement is at the end
