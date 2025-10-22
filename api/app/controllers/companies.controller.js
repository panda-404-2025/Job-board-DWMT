const Company = require('../models/companies.model');

module.exports.getAll = async (req, res, next) => {
    try {
        // On obtiens les entreprises
        const companies = await Company.getAll();
        if (!companies) {
            return res.status(401).json({message: "No companies found"});
        }

        return res.status(200).json({
            companies
        });

    } catch (err) {
        res.status(500).json({error: 'Intern error'});
        console.log(err.stack);
    }
};

module.exports.getById = async (req, res, next) => {
    try {
        // On obtiens l'entreprise
        const company = await Company.getById(req.params.id);

        if (!company) {
            return res.status(401).json({message: "No company found"});
        }

        return res.status(200).json({
            company
        });

    } catch (err) {
        res.status(500).json({error: 'Intern error'});
        console.log(err.stack);
    }
};

module.exports.createCompany = async (req, res, next) => {
    const { name, address,description } = req.body;
    try {
        const company = await Company.insert(name,address,description);
        res.status(201).json(company);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

module.exports.updateCompany = async (req, res, next) => {
    const {name, address, description} = req.body;
    try {
        if(req.user?.id !== req.params.id && req.user?.type_people !== 1) {
            return res.status(401).json({message: "Forbidden access"});
        }
        let company = await Company.getById(req.params.id);
        if (company == null) {
            return res.status(404).json({ message: "No company found" });
        }
        company = await Company.update(req.params.id, name,address,description);
        res.status(200).json(company);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

module.exports.deleteCompanyById =  async (req, res,next) => {
    try {
        let company = await Company.getById(req.params.id);
        if (company == null) {
            return res.status(404).json({ message: "No company found" });
        }
        await Company.delete(req.params.id)
        res.status(200).json({ message: "Company deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


