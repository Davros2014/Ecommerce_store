const fs = require("fs");
const crypto = require("crypto");
const util = require("util");

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository {
    constructor(filename) {
        if (!filename) {
            throw new Error("Creating a repository requires a filename");
        }

        this.filename = filename;
        try {
            fs.accessSync(this.filename);
        } catch (err) {
            fs.writeFileSync(this.filename, "[]");
        }
    }

    async getAll() {
        return JSON.parse(
            await fs.promises.readFile(this.filename, {
                encoding: "utf8"
            })
        );
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

    async comparePasswords(savedPW, suppliedPW) {
        // saved = password saved in our database
        // supplied = password supplied by the user

        // destructures to get hased and salt values
        const [hashed, salt] = savedPW.split(".");
        const hashedSuppliedBuf = await scrypt(suppliedPW, salt, 64);

        return hashed === hashedSuppliedBuf.toString("hex");
    }

    async writeAll(records) {
        await fs.promises.writeFile(
            this.filename,
            JSON.stringify(records, null, 2)
        );
    }

    randomId() {
        return crypto.randomBytes(4).toString("hex");
    }
    // find specific users by id
    async getOne(id) {
        const records = await this.getAll();
        return records.find(record => record.id === id);
    }

    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !== id);
        await this.writeAll(filteredRecords);
    }

    async update(id, attrs) {
        const records = await this.getAll();
        const record = records.find(record => record.id === id);

        if (!record) {
            throw new Error(`Record with id ${id} not found`);
        }

        Object.assign(record, attrs);
        await this.writeAll(records);
    }

    async getOneBy(filters) {
        const records = await this.getAll();

        for (let record of records) {
            let found = true;

            for (let key in filters) {
                if (record[key] !== filters[key]) {
                    found = false;
                }
            }

            if (found) {
                return record;
            }
        }
    }
}

module.exports = new UsersRepository("users.json");
