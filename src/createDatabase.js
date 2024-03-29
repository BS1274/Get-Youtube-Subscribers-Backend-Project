// Import required dependencies
const mongoose = require("mongoose"); 
const subscriberModel = require("./models/subscribers"); 
const data = require("./data"); 
require("dotenv").config(); // Load environment variables from .env file

// Connect to DATABASE
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
});

// Get the database connection object
const dataBase = mongoose.connection; 
// Event listener for connection errors
dataBase.on("error", (err) => console.log(err)); 
// Event listener for successful connection
dataBase.once("open", () => console.log("Database created..."));

// Function to refresh data in the database
const refreshAll = async () => {
  // Delete all existing documents in the "subscribers" collection
  await subscriberModel.deleteMany({}); 
  // Insert new documents from the "data" array into the "subscribers" collection
  await subscriberModel.insertMany(data); 
  // Disconnect from the database
  await mongoose.disconnect(); 
};

refreshAll();
