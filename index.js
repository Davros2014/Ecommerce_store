const express = require("express");
// npm middelware packages
const bodyParser = require("body-parser");
// cookie session after body parser
const cookieSession = require("cookie-session");
// add express router
const expressRouter = require("./routes/admin/auth");

const app = express();

// parses all information from req.body on all post requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({ keys: ["jhbds67suyb34rugwen"] }));

// add routes
app.use(expressRouter);

app.listen(3000, () => {
    console.log("I've been expecting you Mr. Bond....");
});
