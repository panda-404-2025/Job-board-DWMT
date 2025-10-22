const connectDB = require('../connectDB');

const User = {
    getAll: async () => {
        const [ret] = await connectDB.query("SELECT * FROM people");
        return ret
    },
    getById: async (id) => {
        const [ret] = await connectDB.query("SELECT * FROM people WHERE id = ?", [id]);
        return ret[0]
    },
    getByEmail: async (email) => {
        const [ret] = await connectDB.query("SELECT * FROM people WHERE email = ?",[email]);
        return ret[0]
    },getAllEmails: async () => {
      const [ret] = await connectDB.query("SELECT email FROM people");
      return ret
    },
    delete: async (id) => {
        const [ret] = await connectDB.query("DELETE FROM people WHERE id = ?", [id]);
        return ret
    },
    update: async (id,first_name,last_name,email,phone,skills,type,company) => {
        const [ret] = await connectDB.query("UPDATE people SET first_name = ?,last_name = ?, email = ?, phone = ?, skills = ?, type_people = ?, company_id = ? WHERE id = ?", [first_name, last_name, email, phone,JSON.stringify(skills),type,company, id]);
        return ret;
    },updatePassword: async (id,password) => {
        const [ret] = await connectDB.query("UPDATE people SET password = ? where id = ?", [password,id]);
    },
    insert: async (first_name,last_name,email,phone,password,skills,type,company) => {
        const [ret] = await connectDB.query("INSERT INTO people(first_name,last_name,email,phone,password,skills,type_people,company_id) VALUES(?,?,?,?,?,?,?,?)",[first_name,last_name,email,phone,password,JSON.stringify(skills),type,company]);
        return ret;
    }
};

module.exports = User