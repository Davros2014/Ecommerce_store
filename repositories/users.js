const fs = require("fs");

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
        // opens this.filename
        return JSON.parse(
            await fs.promises.readFile(this.filename, {
                encoding: "UTF8"
            })
        );
    }
    async create(attributes) {
        const records = await new this.getAll();
        recordes.push(attributes);

        await fs.promises.writeFile(this.filename);
    }
}

const test = async () => {
    const repo = new UsersRepository("users.json");
    const users = await repo.getAll();
    console.log("users: ", users);
};

test();
