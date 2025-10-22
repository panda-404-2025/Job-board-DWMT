const connectDB = require('../connectDB');

const Ad = {
    getAll: async () => {
        const [ret] = await connectDB.query("SELECT advertisements.id,title,short_description,full_description,salary,position_type,location,schedule,experience, name as company, company_id FROM advertisements JOIN companies ON companies.id = company_id");
        return ret
    },
    getById: async (id) => {
        const [ret] = await connectDB.query("SELECT * FROM advertisements WHERE id = ?", [id]);
        return ret[0]
    },
    getByCompanyId: async (id) => {
        const [ret] = await connectDB.query("SELECT * FROM advertisements WHERE company_id = ?", [id]);
        return ret
    },
    delete: async (id) => {
        const [ret] = await connectDB.query("DELETE FROM advertisements WHERE id = ?", [id]);
        return ret
    },
    update: async (id,title,short_description,full_description,salary,position_type,location,schedule,experience) => {
        const [ret] = await connectDB.query("UPDATE advertisements SET title = ?, short_description = ?, full_description = ?, salary = ? , position_type = ?, location = ?, schedule = ?, experience = ? WHERE id = ?", [title,short_description,full_description,salary,position_type,location,schedule,experience,id]);
        return ret;
    },
    updateAdmin:async (id,title,short_description,full_description,salary,position_type,location,schedule,experience,company_id) => {
        const [ret] = await connectDB.query("UPDATE advertisements SET title = ?, short_description = ?, full_description = ?,  salary = ? , position_type = ?, location = ?, schedule = ?, experience = ? , company_id = ?  WHERE id = ?", [title,short_description,full_description,salary,position_type,location,schedule,experience,company_id,id]);
        return ret;
    },
    insert: async (title,short_description,full_description,salary,position_type,location,schedule,experience,company_id) => {
        const [ret] = await connectDB.query("INSERT INTO advertisements(title,short_description,full_description,salary,position_type,location,schedule,experience,company_id) VALUES(?,?,?,?,?,?,?,?,?)",[title,short_description,full_description,salary,position_type,location,schedule,experience,company_id]);
        return ret;
    }
};

module.exports = Ad;