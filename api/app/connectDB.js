const mysql = require('mysql2');

const connectDB = mysql.createPool({
    host: 'localhost',
    user: 'API_USER',
    password: 'wD7GbP@NcakIU9EB',
    database: 'job_board',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit:0
}).promise();

(async () => {
    try{
        const connect = await connectDB.getConnection();
        console.log('Connected to Database');
        connect.release();
    }catch(err){
        console.error(err);
        throw err;
    }
})();


module.exports = connectDB;