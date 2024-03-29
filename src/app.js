// Import the Express framework
const express = require("express");
const path = require("path");
const Subscriber = require("./models/subscribers"); // Import the Subscriber model

// Create an Express application
const app = express();

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define a route to serve the home page
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

// Route to retrieve all subscribers
app.get("/subscribers", async (_req, res, next) => {
  try {
    const subscribers = await Subscriber.find();
    res.status(200).json(subscribers);
  } catch (err) {
    res.status(400);
    next(err);
  }
});

// Route to retrieve subscribers with only name and subscribedChannel fields
app.get("/subscribers/names", async (_req, res, next) => {
  try {
    const subscribers = await Subscriber.find({}, { name: 1, subscribedChannel: 1, _id: 0 });
    res.status(200).json(subscribers);
  } catch (err) {
    res.status(400);
    next(err);
  }
});

// Route to retrieve subscriber details by ID
app.get("/subscribers/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ message: "No ID provided" });
      return;
    }
    const subscriber = await Subscriber.findById(id);
    if (!subscriber) {
      res.status(404).json({ message: "Subscriber not found" });
      return;
    }
    res.json(subscriber);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Export the Express application
module.exports = app;
