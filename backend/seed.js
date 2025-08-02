const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const DB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/lunchbowl";

const COLLECTIONS = [
    "admins",
    "attributes",
    "categories",
    "coupons",
    "currencies",
    "customers",
    "dishes",
    "forms",
    "holidays",
    "languages",
    "notifications",
    "orders",
    "otps",
    "userpayments",
    "products",
    "schools",
    "settings",
    "usermeals",
];

const seedDir = path.join(__dirname, "seeders");

async function runSeeder() {
    await mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ Connected to MongoDB");

    for (const collection of COLLECTIONS) {
        const filePath = path.join(seedDir, `seed-${collection}.json`);
        if (fs.existsSync(filePath)) {
            const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
            const dbCollection = mongoose.connection.collection(collection);
            await dbCollection.deleteMany({});
            await dbCollection.insertMany(data);
            console.log(`✅ Seeded: ${collection}`);
        } else {
            console.warn(`⚠️ Skipped: ${collection} (No file found)`);
        }
    }

    await mongoose.disconnect();
    console.log("✅ Seeding completed & disconnected");
}

runSeeder().catch((err) => {
    console.error("❌ Seeding failed:", err);
    mongoose.disconnect();
});
