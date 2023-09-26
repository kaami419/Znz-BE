const mongoose = require('mongoose');
const mongodb = require("mongodb").MongoClient;

async function connectToMongo() {
    try {
      await mongoose.connect("mongodb+srv://hamza123:hamza123@cluster0.dw2jcvv.mongodb.net/", 
      { useNewUrlParser: true });
      console.log('Connected to MongoDB');
    } catch (err) {
       console.error('Error connecting to MongoDB', err);
    }
  }
  
module.exports = connectToMongo;

// mongodb+srv://ESP:ESP@clusteresp.pczh54m.mongodb.net/ Sheraz
// mongodb+srv://aarfeenshahzed33:qwerty4321@cluster0.rhptz04.mongodb.net/ Aarfeen
// mongodb+srv://hamza321:hamza321@cluster0.dw2jcvv.mongodb.net/ Hamza