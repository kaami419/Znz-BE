const mongoose = require("mongoose");
const mongodb = require("mongodb").MongoClient;
require("dotenv").config();

async function connectToMongo() {
  try {
    await mongoose.connect(
     process.env.MONGO_CONNECTION,
      { useNewUrlParser: true }
    );
    console.log("Connection to DB Successful"`);
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  }
}

module.exports = connectToMongo;

// mongodb+srv://ESP:ESP@clusteresp.pczh54m.mongodb.net/ Sheraz
// mongodb+srv://aarfeenshahzed33:qwerty4321@cluster0.rhptz04.mongodb.net/ Aarfeen
// mongodb+srv://hamza321:hamza321@cluster0.dw2jcvv.mongodb.net/ Hamza

// mongodb+srv://znzcommunication123:znz112233@cluster0.rbmym9j.mongodb.net/ Global DB
