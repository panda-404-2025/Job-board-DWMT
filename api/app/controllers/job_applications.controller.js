const JobApplication = require('../models/job_applications.model');

module.exports.getAll = async (req, res, next) => {
    try {
        // On obtiens les applications
        const applications = await JobApplication.getAll();
        if (!applications) {
            return res.status(401).json({message: "No job applications found"});
        }

        return res.status(200).json({
            applications
        });

    } catch (err) {
        res.status(500).json({error: 'Intern error'});
        console.log(err.stack);
    }
};

module.exports.getById = async (req, res, next) => {
    try {
        // On obtiens l'application
        const application = await JobApplication.getById(req.params.id);

        if (!application) {
            return res.status(401).json({message: "Job application not found"});
        }

        return res.status(200).json({
            application
        });

    } catch (err) {
        res.status(500).json({error: 'Intern error'});
        console.log(err.stack);
    }
};

module.exports.getByAdId = async (req, res, next) => {
    try {
        // On obtiens l'application
        const application = await JobApplication.getByAdId(req.params.ad_id);

        if (!application) {
            return res.status(401).json({message: "No job applications found"});
        }

        return res.status(200).json({
            application
        });

    } catch (err) {
        res.status(500).json({error: 'Intern error'});
        console.log(err.stack);
    }
};

module.exports.getByPeopleId = async (req, res, next) => {
    try {
        // On obtiens l'application
        const application = await JobApplication.getByPeopleId(req.params.people_id);

        if (!application) {
            return res.status(401).json({message: "No job applications found"});
        }

        return res.status(200).json({
            application
        });

    } catch (err) {
        res.status(500).json({error: 'Intern error'});
        console.log(err.stack);
    }
};

module.exports.createApplication = async (req, res, next) => {
    const {email,first_name,last_name, ad_id,message} = req.body;
    try {
        const application = await JobApplication.insert(email,first_name,last_name,ad_id,message);
        res.status(201).json(application);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

module.exports.updateApplicationUser = async (req, res, next) => {
    const {message} = req.body;
    try {
        let application = await JobApplication.getById(req.params.id);
        if (application == null) {
            return res.status(404).json({ message: "Job application not found" });
        }
        application = await JobApplication.updateUser(req.params.id, message);
        res.status(200).json(application);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

module.exports.updateApplicationAdmin = async (req, res, next) => {
    const {message,first_name,last_name,email} = req.body;
    try {
        let application = await JobApplication.getById(req.params.id);
        if (application == null) {
            return res.status(404).json({ message: "Job application not found" });
        }
        application = await JobApplication.updateAdmin(req.params.id, first_name,last_name,email,message);
        res.status(200).json(application);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};
module.exports.deleteApplicationById =  async (req, res,next) => {
    try {
        let application = await JobApplication.getById(req.params.id);
        if (application == null) {
            return res.status(404).json({ message: "Job application not found" });
        }
        await JobApplication.delete(req.params.id)
        res.status(200).json({ message: "Job application deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


