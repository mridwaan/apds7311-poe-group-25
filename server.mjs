import https from "https"; // Importing https module
import fs from "fs"; // Importing filesystem module
import express from "express"; // Importing Express framework
import cors from "cors"; // Importing CORS middleware
import posts from "./routes/post.mjs"; // Corrected import path for posts route
import users from "./routes/user.mjs"; // Corrected import path for users route

const PORT = 3005; // Set the port number
const app = express(); // Create an instance of the Express application

const options = {
    key: fs.readFileSync('keys/private_key.pem'), // Corrected syntax for reading private key
    cert: fs.readFileSync('keys/certificate.pem') // Corrected syntax for reading certificate
};

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

// Custom headers for CORS
app.use((reg, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Headers', '*'); // Allow all headers
    res.setHeader('Access-Control-Allow-Methods', '*'); // Allow all methods
    next(); // Proceed to the next middleware
});

// Use the posts and users routers
app.use("/post", posts);
app.route("/post", posts);
app.use("/user", users);
app.route("/user", users);

// Create an HTTPS server
let server = https.createServer(options, app); 
server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`); // Log the server's port
});
