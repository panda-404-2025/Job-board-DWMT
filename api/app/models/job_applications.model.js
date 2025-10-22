const connectDB = require('../connectDB');

const JobApplication = {
    getAll: async () => {
        const [ret] = await connectDB.query("SELECT applications.id,applications.email as email,first_name,last_name, advertisements.title as Advertisement,ad_id, companies.name as `from`, date_application,message FROM applications join advertisements on advertisements.id = applications.ad_id join companies on advertisements.company_id=companies.id");
        return ret
    },
    getById: async (id) => {
        const [ret] = await connectDB.query("SELECT * FROM applications WHERE id = ?", [id]);
        return ret[0]
    },
    getByAdId: async (id) => {
        const [ret] = await connectDB.query("SELECT * FROM applications WHERE ad_id = ?", [id]);
        return ret
    },
    getByPeopleEmail: async (email) => {
        const [ret] = await connectDB.query("SELECT * FROM applications WHERE email = ?", [email]);
        return ret
    },
    delete: async (id) => {
        const [ret] = await connectDB.query("DELETE FROM applications WHERE id = ?", [id]);
        return ret
    },
    updateUser: async (id,message) => {
        const [ret] = await connectDB.query("UPDATE applications SET message = ? WHERE id = ?", [message,id]);
        return ret;
    },updateAdmin: async (id,first_name,last_name,email,message) => {
        const [ret] = await connectDB.query("UPDATE applications SET first_name = ?, last_name = ?, email = ?, message = ? WHERE id = ?", [first_name,last_name,email,message,id]);
        return ret;
    },
    insert: async (email,first_name,last_name,ad_id,message) => {
        const [ret] = await connectDB.query("INSERT INTO applications(email,first_name,last_name,ad_id,message,date_application) VALUES(?,?,?,?,?,CURDATE())",[email,first_name,last_name,ad_id,message]);
        return ret;
    }
};

module.exports = JobApplication;