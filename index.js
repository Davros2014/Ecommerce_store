const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("hell0");
});

app.listen(3000, () => {
    console.log("I've been expecting you Mr. Bond....");
});
