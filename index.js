const express = require("express");
const app = express();
// npm middelware packages
const bodyParser = require("body-parser");
// cookie seesion after body parser
const cookieSession = require("cookie-session");

// CRUD methods
const usersRepo = require("./repositories/users");

// parses all information from req.body on all post requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({ keys: ["jhbds67suyb34rugwen"] }));

app.get("/", (req, res) => {
    res.send(
        `<div>
            <form method="POST">
                <input placeholder="email" name="email" />
                <input placeholder="password" name="password" />
                <input placeholder="password confirmation" name="passwordConfirmation" />
                <button >Submit </button>
            </form>
        </div>`
    );
});

app.post("/", async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;
    const existingUser = await usersRepo.getOneBy({ email });
    if (existingUser) {
        return res.send("Email in use  ");
    }
    if (password !== passwordConfirmation) {
        return res.send("Passwords must match ");
    }
    // create a user in our user repo tp represent this person
    const user = await usersRepo.create({ email, password });
    // Store the id of that inside the users cookie
    console.log("req.session", req.session);
    req.session.userId = user.id;
    res.send("Account created!!");
});

app.listen(3000, () => {
    console.log("I've been expecting you Mr. Bond....");
});
