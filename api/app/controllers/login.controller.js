const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports.login = async (req, res, next) => {
    try {
        // On récupère les infos de connexion et on vérifie qu'elles sont renseignées
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({message: "Incorrect login informations"});
        }
        // On authentifie l'utilisateur
        const user = await User.getByEmail(email);
        if (!user) {
            return res.status(401).json({message: "Unknown user"});
        }
        // On vérifie le mot de passe
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({message: "Incorrect password"});
        }

        // On génère le JWT
        const accessToken = jwt.sign(
            {
                userId: user.id,
                email: user.email
            },
            process.env.SECRET_TOKEN,
            {
                algorithm: process.env.TOKEN_ALGORITHM,
                audience: process.env.TOKEN_AUDIENCE,
                expiresIn: process.env.TOKEN_EXPIRES_IN / 1000,
                issuer: process.env.TOKEN_ISSUER,
                subject: user.id.toString()
            }
        );

        /* On envoie le JWT au client   */
        return res.status(200).json({
            accessToken,
            tokenType: process.env.TOKEN_TYPE,
            accessTokenExpiresIn: process.env.TOKEN_EXPIRES_IN,
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                type_people: user.type_people,
                phone: user.phone,
                company_id: user.company_id
            }
        });

    } catch (err) {
        res.status(500).json({error: 'Intern error'});
        console.log(err.stack);
    }
};

