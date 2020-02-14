const fs = require("fs");
const crypto = require("crypto");
const util = require("util");

const Repository = require("./repository");

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
    async comparePasswords(savedPW, suppliedPW) {
        // saved = password saved in our database
        // supplied = password supplied by the user

        // destructures to get hased and salt values
        const [hashed, salt] = savedPW.split(".");
        const hashedSuppliedBuf = await scrypt(suppliedPW, salt, 64);

        return hashed === hashedSuppliedBuf.toString("hex");
    }

    async create(attrs) {
        // always has an object of attrs = {email: "", password: ""}
        attrs.id = this.randomId();

        //generate a salt to add to the hashed password
        const salt = crypto.randomBytes(8).toString("hex");
        //generate a hashed password
        const buf = await scrypt(attrs.password, salt, 64);

        const records = await this.getAll();

        //overwrite password with hashed password + salt - seperated by a period
        const record = {
            ...attrs,
            password: `${buf.toString("hex")}.${salt}`
        };
        records.push(record);

        await this.writeAll(records);

        return record;
    }
}

module.exports = new UsersRepository("users.json");
