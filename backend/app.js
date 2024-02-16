import express from "express";
import mongoose from "mongoose";
import routes from "./routes/routes.js";

const app = express();
const PORT = 3000;

// Use the routes file
app.use("/api", routes);

// Connection to db
mongoose
	.connect("mongodb://localhost:27017/poke")
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("Error connecting to MongoDB:", err));

// Start server
app.listen(PORT, () => console.log("Example app is listening on port 3000."));
