const express = require("express");

// const bodyParser = require("bodyParser");

const app = express();

const bodyParser = (req, res, next) => {
    if (req.method === "POST")
        req.on("data", data => {
            const parsed = data.toString("UTF8").split("&");
            let formData = {};
            for (let pair of parsed) {
                const [key, value] = pair.split("=");
                formData[key] = value;
            }
            console.log("data is: ", formData);
        });
};

app.get("/", (req, res) => {
    res.send(`<div>
            <form method="POST">
                <input placeholder="email" name="email" />
                <input placeholder="password" name="password" />
                <input placeholder="password confirmation" name="passwordConfirmation" />
                <button >Submit </button>
            </form>

        </div>`);
});

app.post("/", (req, res) => {
    console.log("request", req);
    res.send("Account created");
});

app.listen(3000, () => {
    console.log("I've been expecting you Mr. Bond....");
});
