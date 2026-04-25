require("dotenv").config({
    path: require("path").resolve(__dirname, "../.env"),
});

require("dns").setServers(["8.8.8.8", "1.1.1.1"]); // Workaround for ISP blocking MongoDB SRV resolution

const mongoose = require("mongoose");
const dummyData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL =
    process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log(
            "Connected to Database: " +
                (MONGO_URL.includes("mongodb+srv")
                    ? "MongoDB Atlas"
                    : "Local MongoDB"),
        );
    })
    .catch((err) => {
        console.log(err);
    });

const initDB = async () => {
    await Listing.deleteMany({}); // Clears whole database
    dummyData.data = dummyData.data.map((obj) => ({
        ...obj,
        owner: "69eba6bd389f6dd223872cfb", // VinitKumarGupta as the owner of all current listings.
        // Schema logically requires 'geometry' now, adding a default coordinate point logic prevents validation failing.
        geometry: {
            type: "Point",
            coordinates: [77.209, 28.6139], // Defaulting to somewhere (e.g. New Delhi)
        },
    }));
    await Listing.insertMany(dummyData.data); // Fills whole database with dummyData
    // dummyData is an object, we needed the 'data' key from it.
    console.log("Dummy data has been added to the database");
    mongoose.connection.close(); // Important to close once script is done
};

initDB(); // ! Call the function in the end.
