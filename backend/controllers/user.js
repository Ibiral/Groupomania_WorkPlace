let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let models = require('../models');
let utils = require('../utils/jwtUtils');

// Création d'un nouvel utilisateur
exports.signup = (req, res) => {
    // Récupération des imputs dans le body
    let email = req.body.email;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let password = req.body.password;
    let bio = req.body.bio;
    let attachmentURL;
  
    if (req.file != undefined) {
        attachmentURL = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }
    else {
        attachmentURL == null
    };

    if (email == null || firstName == null || lastName == null || password == null) {
        res.status(400).json({ error: 'Veuillez renseigner tous les champs requis' })
    }
    //Trouver un utilisateur
        models.User.findOne({
            attributes: ['email'],
            where: { email: email }
        })
            .then(user => {
                // Si l'utilisateur n'existe pas, on crée un nouveau compte
                if (!user) {
                   // Hashage de mot de passe
                    bcrypt.hash(password, 10, function (err, bcryptPassword) {
                        const newUser = models.User.create({
                            email: email,
                            firstName: firstName,
                            lastName: lastName,
                            password: bcryptPassword,
                            profilePic: attachmentURL,
                            bio: bio,
                            isAdmin: false
                        })
                            .then(newUser => { res.status(201).json({ 'id': newUser.id }) })
                            .catch(err => {
                                res.status(500).json({ err })
                            })
                    })
                }
                
                else {
                    res.status(409).json({ error: 'Cet email est déjà pris' })
                }
            })
            .catch(err => { res.status(500).json({ err }) })
};

// Authentification de l'utilisateur
exports.login = (req, res) => {
    // Récupération des inputs dans le body
    let email = req.body.email;
    let password = req.body.password;
    //Trouver un utilisateur
        models.User.findOne({
            where: { email: email }
        })
            .then(user => {
                // Vérifier le mot de passe de l'utilisateur
                if (user) {
                    bcrypt.compare(password, user.password, (errComparePassword, resComparePassword) => {
                     // Générer un token pour cet utilisateur    
                        if (resComparePassword) {
                            res.status(200).json({
                                userId: user.id,
                                token: utils.generateToken(user),
                                isAdmin: user.isAdmin
                            })
                     
                        } else {
                            res.status(403).json({ error: 'Mot de passe invalide' });
                        };
                    })
               
                } else {
                    res.status(404).json({ 'erreur': "Utilisateur introuvable" })
                }
            })
            .catch(err => { res.status(500).json({ err }) })
        };

// Récupérer les informations d'un utilisateur
exports.getUserProfile = (req, res) => {
    
    let id = utils.getUserId(req.headers.authorization)
    // Trouver l'utilisateur qui correspond au token 
    models.User.findOne({
        attributes: ['id', 'email', 'firstName', 'lastName', 'profilePic', 'bio', 'isAdmin'],
        where: { id: id }
    })
    .then(user => res.status(200).json(user))
    .catch(error => res.status(500).json(error))
};

//Modification du profil de l'utilisateur
exports.updateProfile = (req, res) => {
    
    // Récupérer l'id utilisateur
    let userId = utils.getUserId(req.headers.authorization);
    // Récupérer les inputs utilisateur dans le body
    const lastName = req.body.lastName;
    const firstName = req.body.firstName;
    const bio = req.body.bio;
    let attachmentURL;
    
    if (req.file != undefined) {
        attachmentURL = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }
    else {
        attachmentURL == null
    };
    // Trouver l'utulisateur qui correspond au token
        models.User.findOne({
            attributes: ['id','bio'],
            where: { id: userId }
        })
    // Modifier les informations renseignées par l'utilisateur
        .then(user => {
        user.update({
            firstName:(firstName ? firstName : user.firstName),
            lastName:(lastName ? lastName : user.lastName),
            profilePic:(attachmentURL ? attachmentURL : user.profilePic),
            bio: (bio ? bio : user.bio)
        })
        .then(() => res.status(201).json({ confirmation: 'Le profil est modifié avec succès !'}))
        .catch(err => res.status(500).json(err))

        })
        .catch(err => json(err))
    
};

// Suppression d'un utilisateur
exports.deleteProfile = (req, res) => {
   
    let userId = utils.getUserId(req.headers.authorization);
    if (userId != null) {
    // Si l'utilisateur est trouvé, on supprime son compte et toutes ses publications, commentaires et likes
        models.User.findOne({
            where: { id: userId }
        })
            .then(user => {
                if (user != null) {
                // Suppression du compte   
                    models.Post
                        .destroy({
                            where: { userId: user.id }
                        })
                        .then(() => {
                            console.log('Suppression réussie !');
                            
                            models.User
                                .destroy({
                                    where: { id: user.id }
                                })
                                .then(() => res.end())
                                .catch(err => console.log(err))
                        })
                        .catch(err => res.status(500).json(err))
                }
                
                else {
                    res.status(401).json({ error: 'Utilisateur introuvable !' })
                }
            })
    } else {
        res.status(500).json({ error: 'Suppression impossible !' })
    }
}
