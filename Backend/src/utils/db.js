const mongoose = require("mongoose");
const dns = require('dns');
if (process.env.NODE_ENV !== "production") {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
}
require("dotenv").config();

const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully")
    } catch (error) {
        console.log("MongoDB connection failed", error)
    }
}

module.exports = ConnectDB;