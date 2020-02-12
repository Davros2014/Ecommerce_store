const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send(`<div>
            <form>
                <input placeholder="email" value="email" />
                <input placeholder="password" value="password" />
                <input placeholder="password confirmation" value="confirmation" />
                <button >Submit </button>
            </form>

        </div>`);
});

app.listen(3000, () => {
    console.log("I've been expecting you Mr. Bond....");
});
