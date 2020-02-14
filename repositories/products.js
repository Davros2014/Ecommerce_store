const fs = require("fs");
const crypto = require("crypto");
const util = require("util");

const Repository = require("./repository");

const scrypt = util.promisify(crypto.scrypt);

class ProductsRepository extends Repository {}

module.exports = new ProductsRepository("products.json");
