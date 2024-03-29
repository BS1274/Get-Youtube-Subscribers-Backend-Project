const express = require("express");
const mongoose = require("mongoose");
const data = require("./src/data");
require("dotenv").config();
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'src')));

// Define the schema for subscribers
const subscriberSchema = new mongoose.Schema({
  name: String,
  subscribedChannel: String
});

// Define the Subscriber model
const Subscriber = mongoose.model('Subscriber', subscriberSchema);

// Connect to the database
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log("Connected to database");

  // Check if there are any existing documents in the collection
  const existingData = await Subscriber.find();
  if (existingData.length === 0) {
    // Insert data only if the collection is empty
    const insertedData = await Subscriber.insertMany(data);
    console.log("Data added successfully to the database:", insertedData);
  } else {
    console.log("Data already exists in the database. Skipping insertion.");
  }

  // Log the number of documents in the collection
  const subscriberCount = await Subscriber.countDocuments();
  console.log("Number of documents in the collection:", subscriberCount);

  // Define a route to retrieve all subscribers at /subscribers endpoint
  app.get("/subscribers", async (req, res) => {
    try {
      // Retrieve all subscribers from the database
      const subscribers = await Subscriber.find();
      // Format the data to be more readable
      const formattedSubscribers = subscribers.map(subscriber => {
        return {
          id: subscriber._id,
          name: subscriber.name,
          subscribedChannel: subscriber.subscribedChannel
        };
      });
      // Send the formatted subscribers as a JSON response
      res.json(formattedSubscribers);
    } catch (error) {
      // If an error occurs, send a 500 status with the error message
      res.status(500).json({ error: error.message });
    }
  });

  // Route to retrieve subscribers with only name and subscribedChannel fields
  app.get("/subscribers/names", async (req, res) => {
    try {
      // Retrieve subscribers with only name and subscribedChannel fields
      const subscribers = await Subscriber.find({}, { name: 1, subscribedChannel: 1, _id: 0 });
      // Send the subscribers as a JSON response
      res.json(subscribers);
    } catch (error) {
      // If an error occurs, send a 500 status with the error message
      res.status(500).json({ error: error.message });
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
      // Send the subscriber details as a JSON response
      res.json(subscriber);
    } catch (error) {
      // If an error occurs, send a 500 status with the error message
      res.status(500).json({ error: error.message });
    }
  });

  // Define a route handler for the root URL
  app.get("/", (req, res) => {
    // Serve the index.html file
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})
.catch((error) => {
  console.error("Error connecting to database:", error);
});
