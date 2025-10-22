module.exports = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.type_people;
        if (!userRole) {
            return res.status(403).json({ message: "No role associated" });
        }

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: "Forbidden Access" });
        }

        next();
    };
};