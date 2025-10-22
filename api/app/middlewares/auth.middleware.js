const jwt = require('jsonwebtoken');
const User = require('../models/user.model');


async function auth(req, res, next) {
    try {
        const {headers} = req;

        /* On vérifie que le header Authorization est présent dans la requête */
        if (!headers || !headers.authorization) {
            return res.status(401).json({message: 'Missing Authorization header'});
        }

        /* On vérifie que le header Authorization contient bien le token */
        const [scheme, token] = headers.authorization.split(' ');

        if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
            return res.status(401).json({
                message: 'Header format is Authorization: Bearer token'
            });
        }
        /* On vérifie et décode le token à l'aide du secret et de l'algorithme utilisé pour le générer */
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN, {
            algorithms: [process.env.TOKEN_ALGORITHM]
        });

        /* On vérifie que l'utilisateur récupéré dans le token existe en bdd */
        const userId = decodedToken.sub;

        const user = await User.getById(userId)
        if (!user) {
            return res.status(401).json({message: `User ${userId} don't exist`})
        }

        /* On ajoute l'utilisateur authentifié à req pour pouvoir l'utiliser dans les contrôleurs */
        req.user = user;

        /* On appelle le prochain middleware */
        return next();

    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Token expired'
            });
        } else {
            return res.status(401).json({
                message: 'Invalid token'
            });
        }
    }
}

module.exports = auth;