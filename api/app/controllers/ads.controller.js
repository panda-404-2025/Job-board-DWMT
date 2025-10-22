const Ad = require('../models/ads.model');
const JobApplication = require("../models/companies.model");

module.exports.getAll = async (req, res, next) => {
    try {
        // On obtiens les annonces
        const ads = await Ad.getAll();
        if (!ads) {
            return res.status(401).json({message: "No advertisements found"});
        }

        return res.status(200).json({
            ads
        });

    } catch (err) {
        res.status(500).json({error: 'Intern error'});
        console.log(err.stack);
    }
};

module.exports.getById = async (req, res, next) => {
    try {
        // On obtiens l'annonce'
        const ad = await Ad.getById(req.params.id);

        if (!ad) {
            return res.status(401).json({message: "No advertisement found"});
        }

        return res.status(200).json({
            ad
        });

    } catch (err) {
        res.status(500).json({error: 'Intern error'});
        console.log(err.stack);
    }
};

module.exports.getByCompanyId = async (req, res, next) => {
    try {
        // On obtiens l'application
        const ads = await Ad.getByCompanyId(req.params.company_id);

        if (!ads) {
            return res.status(401).json({message: "No advertisements found"});
        }

        return res.status(200).json({
            ads
        });

    } catch (err) {
        res.status(500).json({error: 'Intern Error'});
        console.log(err.stack);
    }
};

module.exports.createAd = async (req, res, next) => {
    const {title,short_description,full_description,salary,position_type,location,schedule,experience} = req.body;
    try {
        if(req.user?.type_people !== 2) {
            return res.status(401).json({message: "Forbidden access"});
        }
        const ad = await Ad.insert(title,short_description,full_description,salary,position_type,location,schedule,experience,req.user?.company_id);
        res.status(201).json(ad);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};
module.exports.createAdAdmin = async (req, res, next) => {
    const {title,short_description,full_description,salary,position_type,location,schedule,experience,company_id} = req.body;
    try {
        if(req.user?.type_people !== 1) {
            return res.status(401).json({message: "Forbidden access"});
        }
        const ad = await Ad.insert(title,short_description,full_description,salary,position_type,location,schedule,experience,company_id);
        res.status(201).json(ad);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};


module.exports.updateAd = async (req, res, next) => {
    const {title,short_description,full_description,salary,position_type,location,schedule,experience} = req.body;
    try {
        if(req.user?.type_people !== 2) {
            return res.status(401).json({message: "Forbidden access"});
        }
        let ad = await Ad.getById(req.params.id);
        if (ad == null) {
            return res.status(404).json({ message: "No advertisement found" });
        }
        if(req.user?.company_id !== ad.company_id) {
            return res.status(401).json({message: "Forbidden access : advertisement of another company"});
        }
        ad = await Ad.update(req.params.id, title,short_description,full_description,salary,position_type,location,schedule,experience);
        res.status(200).json(ad);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};
module.exports.updateAdAdmin = async (req, res, next) => {
    const {title,short_description,full_description,salary,position_type,location,schedule,experience,company_id} = req.body;
    try {
        if(req.user?.type_people !== 1) {
            return res.status(401).json({message: "Forbidden access"});
        }
        let ad = await Ad.getById(req.params.id);
        if (ad == null) {
            return res.status(404).json({ message: "No advertisement found" });
        }
        ad = await Ad.updateAdmin(req.params.id, title,short_description,full_description,salary,position_type,location,schedule,experience,company_id);
        res.status(200).json(ad);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

module.exports.deleteAdById =  async (req, res,next) => {
    try {

        let ad = await Ad.getById(req.params.id);
        if (ad == null) {
            return res.status(404).json({ message: "No advertisement found" });
        }
        if(req.user?.company_id !== ad.company_id && req.user?.type_people !== 1) {
            return res.status(401).json({message: "Forbidden access"});
        }
        await Ad.delete(req.params.id)
        res.status(200).json({ message: "Advertisement deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


