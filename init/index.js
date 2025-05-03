const mongoose = require("mongoose");
const dummyData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("Connected to Database: wanderlust");
    })
    .catch((err) => {
        console.log(err);
    });

const initDB = async () => {
    await Listing.deleteMany({}); // Clears whole database
    dummyData.data = dummyData.data.map((obj) => ({
        ...obj,
        owner: "67e7cb14b99002329c172ab5", // VinitKumarGupta as the owner of all current listings.
    }));
    await Listing.insertMany(dummyData.data); // Fills whole database with dummyData
    // dummyData is an object, we needed the 'data' key from it.
    console.log("Dummy data has been added to the database");
};

initDB(); // ! Call the function in the end.
