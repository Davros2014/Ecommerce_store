const express = require("express");
// npm middelware packages
const bodyParser = require("body-parser");
// cookie session after body parser
const cookieSession = require("cookie-session");
// add express router
const authRouter = require("./routes/admin/auth");
const productsRouter = require("./routes/admin/productsMain");

const signupTemplate = require("./views/admin/auth/signup");

const app = express();

// access public directory for static files > css, images etc
app.use(express.static("./public"));

// parses all information from req.body on all post requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cookieSession({
        keys: ["lkasld235j"]
    })
);

// add routes
app.use(authRouter);
app.use(productsRouter);

app.get("*", function(req, res) {
    res.send("the page you are looking for doesn't exist");
});

app.listen(3000, () => {
    console.log("I've been expecting you Mr. Bond....");
});
