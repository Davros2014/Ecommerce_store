// CRUD methods
const usersRepo = require("../../repositories/users");
const express = require("express");

const router = express.Router();

router.get("/signup", (req, res) => {
    res.send(
        `<div>
            <h1> Your id is ${req.session.userId} </h1>
            <form method="POST">
                <input placeholder="email" name="email" />
                <input placeholder="password" name="password" />
                <input placeholder="password confirmation" name="passwordConfirmation" />
                <button >Submit </button>
            </form>
        </div>`
    );
});

router.post("/signup", async (req, res) => {
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

    req.session.userId = user.id;
    console.log("req.session.userId", req.session.userId);
    res.send("Account created!!");
});

router.get("/signout", (req, res) => {
    req.session = null;
    res.send("you are logged out");
});

router.get("/signin", (req, res) => {
    res.send(
        `<div>
            <form method="POST">
                <input placeholder="email" name="email" />
                <input placeholder="password" name="password" />
                <button >SIGN IN </button>
            </form>
        </div>`
    );
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    console.log("req.body", req.body);
    const user = await usersRepo.getOneBy({ email });
    if (!user) {
        return res.send("Email not found");
    }
    const vaildPassword = await usersRepo.comparePasswords(
        user.password,
        password
    );

    if (!vaildPassword) {
        console.log("user.password", user.password);
        console.log("password", password);
        return res.send("Invalid password");
    }
    req.session.userId = user.id;
    res.send("You are signed in");
});

module.exports = router;
