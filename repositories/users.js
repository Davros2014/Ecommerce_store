const fs = require("fs");

const crypto = require("crypto");

class UsersRepository {
    constructor(filename) {
        if (!filename) {
            throw new Error("Creating a new repository requires a filename");
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
                encoding: "UTF8"
            })
        );
    }

    async create(attrs) {
        attrs.id = this.randomId();
        const records = await this.getAll();
        records.push(attrs);

        await this.writeAll(records);
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
        // opens this.filename
        const records = await this.getAll();
        return records.find(record => record.id === id);
    }

    async delete(id) {
        // opens this.filename
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !== id);
        await this.writeAll(filteredRecords);
    }

    async update(id, attrs) {
        // opens this.filename
        const records = await this.getAll();
        const record = records.find(record => record.id === id);
        if (!record) {
            throw new Error(`Record with id ${id} cannot be found`);
        }
        Object.assign(record, attrs);
        await this.writeAll(records);
    }

    async getOneBy(filters) {
        // opens this.filename
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

// const test = async () => {
//     const repo = new UsersRepository("users.json");
//     // await repo.create({ email: "test@test.com" });
//
//     // await repo.update("2514e13a", { password: "newpassword" });
//     const user = await repo.getOneBy({
//         ergererg: "regerg"
//     });
//     console.log("user: ", user);
// };

module.exports = new UsersRepository("users.json ");
