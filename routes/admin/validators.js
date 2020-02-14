const { check } = require("express-validator");
const usersRepo = require("../../repositories/users");

module.exports = {
    // FOR ADMIN/PRODUCTS/NEW
    requireTitle: check("title")
        .trim()
        .isLength({ min: 1, max: 40 }),
    requirePrice: check("price")
        .trim()
        .toFloat()
        .isFloat({ min: 1 }),
    requireEmail: check("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Must be a valid email")
        .custom(async email => {
            const existingUser = await usersRepo.getOneBy({ email });
            if (existingUser) {
                throw new Error(
                    "Sorry, the email you supplied is already in use!"
                );
            }
        }),
    requirePassword: check("password")
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("Password must be between 4 and 20 characters long"),
    requirePasswordConfirmation: check("passwordConfirmation")
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("Password must be between 4 and 20 characters long")
        .custom((passwordConfirmation, { req }) => {
            if (passwordConfirmation !== req.body.password) {
                throw new Error("Passwords must match");
            }
            return true;
        }),
    requireEmailExists: check("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Must provide a valid email")
        .custom(async email => {
            const user = await usersRepo.getOneBy({ email });
            if (!user) {
                throw new Error("Email not found");
            }
        }),
    requireValidUserPassword: check("password")
        .trim()
        .custom(async (password, { req }) => {
            const user = await usersRepo.getOneBy({
                email: req.body.email
            });
            if (!user) {
                throw new Error("Password does exist for this user!");
            }
            const validPassword = await usersRepo.comparePasswords(
                user.password,
                password
            );
            if (!validPassword) {
                console.log("user.password", user.password);
                console.log("password", password);
                throw new Error("Password is incorrect");
            }
            return true;
        })
};
