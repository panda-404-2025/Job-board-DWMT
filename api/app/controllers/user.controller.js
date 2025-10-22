const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.getAll = async (req, res, next) => {
    try {
        // On obtiens les utilisateurs
        const users = await User.getAll();

        if (!users) {
            return res.status(401).json({message: "No user found"});
        }

        return res.status(200).json({
            users
        });

    } catch (err) {
        res.status(500).json({error: 'Intern error'});
        console.log(err.stack);
    }
};

module.exports.getById = async (req, res, next) => {
    try {
        // On obtiens l'utilisateur
        const user = await User.getById(req.params.id);

        if (!user) {
            return res.status(401).json({message: "User not found"});
        }

        return res.status(200).json({
            user
        });

    } catch (err) {
        res.status(500).json({error: 'Intern error'});
        console.log(err.stack);
    }
};

module.exports.getAllEmails = async (req, res, next) => {
    try {

        const emails = await User.getAllEmails();

        return res.status(200).json({
            emails: emails || []
        });

    } catch (err) {
        res.status(500).json({error: 'Intern error'});
        console.log(err.stack);
    }
};

module.exports.register = async (req, res, next) => {
    const {last_name, first_name, email,phone, password,skills, type, company_id } = req.body;
    try {
        if (parseInt(type) === 2 && !company_id) {
            return res.status(400).json({ message: "Company required for user" });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.insert(first_name, last_name, email,phone, hashPassword,skills, type, company_id);
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

module.exports.updateUser = async (req, res, next) => {
    const {first_name,last_name,email,phone,skills,type,company} = req.body;
    try {
        if(req.user?.id !== parseInt(req.params.id) && req.user?.type_people !== 1) {
            return res.status(401).json({message: "Forbidden Access"});
        }
        let user = await User.getById(req.params.id);
        if (user == null) {
            return res.status(404).json({ message: "User not found" });
        }
        user = await User.update(req.params.id, first_name, last_name, email,phone,skills,type,company);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};
module.exports.updateUserPassword = async (req, res, next) => {
    const {password} = req.body;
    try {
        if(req.user?.id !== parseInt(req.params.id) && req.user?.type_people !== 1) {
            return res.status(401).json({message: "Forbidden Access"});
        }
        let user = await User.getById(req.params.id);
        if (user == null) {
            return res.status(404).json({ message: "User not found" });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        user = await User.update(req.params.id,hashPassword);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

module.exports.deleteUserById =  async (req, res,next) => {
    try {
        if(req.user?.id !== parseInt(req.params.id) && req.user?.type_people !== 1) {
            return res.status(401).json({message: "Forbidden access"});
        }
        let user = await User.getById(req.params.id);
        if (user == null) {
            return res.status(404).json({ message: "User not found" });
        }
        await User.delete(req.params.id)
        res.status(200).json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


