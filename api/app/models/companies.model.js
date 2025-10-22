const connectDB = require('../connectDB');

const Company = {
    getAll: async () => {
        const [ret] = await connectDB.query("SELECT * FROM companies");
        return ret
    },
    getById: async (id) => {
        const [ret] = await connectDB.query("SELECT * FROM companies WHERE id = ?", [id]);
        return ret[0]
    },
    delete: async (id) => {
        const [ret] = await connectDB.query("DELETE FROM companies WHERE id = ?", [id]);
        return ret
    },
    update: async (id,name,address,description) => {
        const [ret] = await connectDB.query("UPDATE companies SET name = ?,address = ?, description = ? WHERE id = ?", [name, address, description,id]);
        return ret;
    },
    insert: async (name,address,description) => {
        const [ret] = await connectDB.query("INSERT INTO companies(name,address,description) VALUES(?,?,?)",[name,address,description]);
        return ret;
    }
};

module.exports = Company;