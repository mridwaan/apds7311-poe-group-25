import express from "express";
import db from "../db/conn.mjs"; // Fixed the import path and syntax
import { ObjectId } from "mongodb"; // Fixed import

const router = express.Router();

// Get all the records
router.get("/", async (req, res) => { // Fixed method name and parameters
    try {
        let collection = await db.collection("posts"); // Fixed assignment operator
        let results = await collection.find({}).toArray(); // Fixed method chaining
        res.status(200).send(results); // Corrected response status
    } catch (error) {
        res.status(500).send({ error: "Failed to fetch records" }); // Added error handling
    }
});

// Create a new record
router.post("/", async (req, res) => { // Fixed method name to post
    try {
        let newDocument = { // Fixed object literal syntax
            user: req.body.user,
            content: req.body.content,
            image: req.body.image
        };

        let collection = await db.collection("posts");
        let result = await collection.insertOne(newDocument); // Corrected method name
        res.status(201).send(result); // Use 201 status for created resource
    } catch (error) {
        res.status(500).send({ error: "Failed to create record" }); // Added error handling
    }
});

// Update a record by ID
router.patch("/:id", async (req, res) => { // Fixed method name and syntax
    try {
        const query = { _id: new ObjectId(req.params.id) }; // Fixed query object syntax
        const updates = {
            $set: {
                name: req.body.name, 
                comment: req.body.comment
            }
        };

        let collection = await db.collection("posts"); 
        let result = await collection.updateOne(query, updates); // Corrected method name

        if (result.modifiedCount === 0) {
            return res.status(404).send({ error: "Record not found" }); // Handle case when no record is updated
        }

        res.status(200).send(result); // Fixed response method
    } catch (error) {
        res.status(500).send({ error: "Failed to update record" }); // Added error handling
    }
});

export default router; // Ensure export statement is at the end
