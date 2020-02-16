const express = require("express");

// imports check function from express-validator
const { check, validationResult } = require("express-validator");

// CRUD methods
const usersRepo = require("../../repositories/users");
const { handleErrors } = require("./middlewares");

//add html
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");

const {
    requireEmail,
    requirePassword,
    requirePasswordConfirmation,
    requireEmailExists,
    requireValidUserPassword
} = require("./validators");

const router = express.Router();

// SIGNUP ////////////////////////////
router.get("/signup", (req, res) => {
    res.send(signupTemplate({ req }));
});
router.post(
    "/signup",
    [requireEmail, requirePassword, requirePasswordConfirmation],
    handleErrors(signupTemplate),
    async (req, res) => {
        const { email, password, passwordConfirmation } = req.body;

        // create a user in our user repo tp represent this person
        const user = await usersRepo.create({ email, password });
        // Store the id of that inside the users cookie
        req.session.userId = user.id;
        console.log("req.session.userId", req.session.userId);
        res.redirect("/admin/products");
    }
);

// SIGNOUT ////////////////////////////
router.get("/signout", (req, res) => {
    req.session = null;
    res.send("you are logged out");
});

// SIGNIN////////////////////////////
router.get("/signin", (req, res) => {
    res.send(signinTemplate({}));
});
router.post(
    "/signin",
    [requireEmailExists, requireValidUserPassword],
    handleErrors(signinTemplate),
    async (req, res) => {
        const { email, password } = req.body;
        const user = await usersRepo.getOneBy({ email });
        req.session.userId = user.id;
        console.log("req.session.userId", req.session.userId);
        res.redirect("/admin/products");
    }
);

module.exports = router;
