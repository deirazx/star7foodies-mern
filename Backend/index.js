const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 8000

app.get("/", (req, res) => {
    res.send("<h1>Welcome to Star7Foodies</h1>")
})

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`)
})