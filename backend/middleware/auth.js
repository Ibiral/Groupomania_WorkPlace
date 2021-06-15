const jwt = require('jsonwebtoken');

// Authentification
module.exports = (req, res, next) => {
    // Récupérer le token dans le headers
    const authHeader = req.headers.authorization;

    //Vérifier la validité du Token
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.TOKEN, (err, user) => {
            if (err) {
                return res.status(403).json(err);
            }
            next();
        });
    }
    // Refuser l'accès si le token n'est pas trouvé
    else {
        res.status(401).json({error:"accès non authorisé"});
    }
};