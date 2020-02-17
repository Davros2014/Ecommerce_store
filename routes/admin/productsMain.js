const express = require("express");
const { handleErrors, requireAuthorisation } = require("./middlewares");

// add multer
var multer = require("multer");
var upload = multer({ storage: multer.memoryStorage() });

const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/new");
const productsIndexTemplate = require("../../views/admin/products/index");
const productsEditTemplate = require("../../views/admin/products/edit");

const { requireTitle, requirePrice } = require("./validators");

const router = express.Router();

// PRODUCT PAGE //////////////////////////////////////////////////////
router.get("/admin/products", requireAuthorisation, async (req, res) => {
    const products = await productsRepo.getAll();
    res.send(productsIndexTemplate({ products }));
});

// NEW PRODUCT PAGE //////////////////////////////////////////////////////
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

// EDIT PRODUCT PAGE //////////////////////////////////////////////////////
router.get(
    "/admin/products/:id/edit",
    requireAuthorisation,
    async (req, res) => {
        const product = await productsRepo.getOne(req.params.id);
        if (!product) {
            return res.send(
                "Sorry, the product you are looking for no longer exists"
            );
        }
        res.send(productsEditTemplate({ product }));
    }
);

router.post(
    "/admin/products/:id/edit",
    requireAuthorisation,
    upload.single("image"),
    [requireTitle, requirePrice],
    handleErrors(productsEditTemplate, async req => {
        const product = await productsRepo.getOne(req.params.id);
        return { product };
    }),
    async (req, res) => {
        const changes = req.body;
        if (req.file) {
            changes.image = req.file.buffer.toString("base64");
        }
        try {
            await productsRepo.update(req.params.id, changes);
        } catch (err) {
            return res.send("Item could not be found");
        }
        res.redirect("/admin/products");
    }
);

// DELETE PRODUCT
router.post(
    "/admin/products/:id/delete",
    requireAuthorisation,
    async (req, res) => {
        await productsRepo.delete(req.params.id);
        res.redirect("/admin/products");
    }
);

module.exports = router;
