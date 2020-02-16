const express = require("express");
const { handleErrors, requireAuthorisation } = require("./middlewares");

// add multer
var multer = require("multer");
var upload = multer({ storage: multer.memoryStorage() });

const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/new");
const productsIndexTemplate = require("../../views/admin/products/index");

const { requireTitle, requirePrice } = require("./validators");

const router = express.Router();

router.get("/admin/products", requireAuthorisation, async (req, res) => {
    const products = await productsRepo.getAll();
    res.send(productsIndexTemplate({ products }));
});

router.get("/admin/products/new", requireAuthorisation, (req, res) => {
    res.send(productsNewTemplate({}));
});
router.post(
    "/admin/products/new",
    requireAuthorisation,
    upload.single("image"),
    [requireTitle, requirePrice],
    handleErrors(productsNewTemplate),
    async (req, res) => {
        console.log("req.body products/new route", req.body);

        const image = req.file.buffer.toString("base64");
        const { title, price } = req.body;
        await productsRepo.create({ title, price, image });

        res.redirect("/admin/products");
    }
);

module.exports = router;
