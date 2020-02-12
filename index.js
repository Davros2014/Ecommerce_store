const express = require("express");

const bodyParser = require("body-parser");

const app = express();

const usersRepo = require("./repositories/users");

// parses all information from req.body on all post requests
app.use(bodyParser.urlencoded({ extended: true }));

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
    // console.log("data is: ", data);
    // console.log("email is: ", email);
    // console.log("password is: ", password);
    // console.log("passwordConfirmation is: ", passwordConfirmation);
    res.send("Account created!!");
});

app.listen(3000, () => {
    console.log("I've been expecting you Mr. Bond....");
});
