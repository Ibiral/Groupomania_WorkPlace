let models = require('../models');
let utils = require('../utils/jwtUtils');
const fs = require('fs');
const post = require('../models/post');

// Création d'une nouvelle publication
exports.createPost = (req, res) => {
    let attachmentURL
    // Identify the post creator by finding the user that has the same id as the one from the token
    let id = utils.getUserId(req.headers.authorization)
    models.User.findOne({
        attributes: ['id', 'firstName', 'lastName'],
        where: { id: id }
    })
    .then(user => {
        // Si l'utilisateur existe
        if (user !== null) {
            // Récupération des inputs utilisateur
            let title = req.body.title;
            let content = req.body.content;
            if (req.file != undefined) {
                attachmentURL = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
            }
            else {
                attachmentURL == null
            };


            // Vérifier si tous les champs requis sont renseignés
            if ((title == 'null' && content == 'null' && attachmentURL == null)) {
                res.status(400).json({ error: 'Veuillez renseigner tous les champs requis !' })
            } 
            //Création de la publication
                models.Post.create({
                    title: title,
                    content: content,
                    attachment: attachmentURL,
                    UserId: user.id
                })
                .then((newPost) => {
                    res.status(201).json(newPost)
                })
                .catch((err) => {
                    res.status(500).json(err)
                })
            } else {
            res.status(400).json(error);
        }
    })
    .catch(error => res.status(500).json(error));
},

// Récuperation de toutes les publications
exports.getAllPosts = (req, res) => {
    // Récupérer toutes les publications et les informations de leurs auteurs
    models.Post.findAll({
        include: [{
            model: models.User,
            attributes: ['lastName' , 'firstName' , 'profilePic']
        },{
            model: models.UserReact,
            required: false,
            attributes: ['userId', 'type']
            
        },{
            model: models.Comment,
            required: false,
            attributes: ['content'],
            include: [{
                model: models.User,
                attributes: ['firstName', 'lastName', 'profilePic']
            }]
            
        }],
        order: [['createdAt', 'DESC']]
    })
    // Envoyer les publications si elles existent
    .then(posts => {
        if (posts.length > null) {
            res.status(200).json(posts)
        } else {
            res.status(404).json({ error: 'Aucune publication trouvée' })
        }
    })
    .catch(err => res.status(500).json(err))
},

// Récupérer une seule publication
exports.getOnePost = (req, res) => {
    // Vérifier si la publication contient le même id que dans le token
    models.Post.findOne({
        where: { id: req.params.id},
        include: [{
            model: models.User,
            attributes: ['firstName', 'lastName', 'profilePic', 'id']
        },{
            model: models.UserReact,
            required: false,
            attributes: ['userId', 'type']
            
        },{
            model: models.Comment,
            required: false,
            attributes: ['content', 'id'],
            include: [{
                model: models.User,
                attributes: ['firstName', 'lastName', 'profilePic', 'id']
            }]  
        }]
    })
    // Renvoyer la publication et les infos de son auteur
    .then(post => {
        let userConnectedId = utils.getUserId(req.headers.authorization);
        let postAndUserInfo = {
            singlePost : post,
            userConnected : userConnectedId
        };
        res.status(200).json(postAndUserInfo)
    })
    .catch(err => res.status(500).json(err))
},

// Modification d'une publication
exports.updatePost = (req, res) => {
    // Récupération de l'id de l'auteur de la publication
    let userOrder = req.body.userIdOrder;
    let attachmentURL
    // Trouver l'utilisateur connecté
    let id = utils.getUserId(req.headers.authorization)
    models.User.findOne({
        attributes: ['id', 'email', 'firstName', 'lastName', 'isAdmin'],
        where: { id: id }
    })
    .then(user => {
        // Si l'utilisateur est l'auteur de la publication ou s'il est admin, il sera autorisé de modifier la publication
        if (user && (user.isAdmin == true || user.id == userOrder)) {
             // Récupération des inputs utilisateur 
            let title = req.body.newTitle;
            let content = req.body.newContent;
            if (req.file != undefined) {
                attachmentURL = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
                console.log(attachmentURL)
            }
            else {
                attachmentURL == null
            };

                // Modifier que les champs modifiés et garder le reste
                models.Post.update({
                    title: (title ? title : post.title),
                    content: (content ? content : post.content),
                    attachment: (attachmentURL ? attachmentURL : post.attachment)
                },
                { where: { id: req.params.id }}
                )
                .then(() => {res.status(201).json({confirmation: 'Modification réussie !'})})
                .catch((err) => {res.status(500).json(err)})
            } 
         else {
            res.status(401).json({ error: "Vous n'êtes pas autorisé à modifier cette publication" })
        }
    })
    .catch(() => res.status(500).json(error));
},
    
// Suppression d'une publication
exports.deletePost = (req, res) => {
    let userOrder = req.body.userIdOrder;
    // Réucpération de l'id utilisateur
    let id = utils.getUserId(req.headers.authorization)
    models.User.findOne({
        attributes: ['id', 'email', 'firstName','lastName', 'isAdmin'],
        where: { id: id }
    })
    .then(user => {
        // Vérifier si l'utilisateur est autorisé de supprimer la publication
        if (user && (user.isAdmin == true || user.id == userOrder)) {
            console.log('Suppression de la publication avec l Id :', req.params.id);
            models.Post
            .findOne({
                where: { id: req.params.id }
            })
            .then((postFind) => {
                if (postFind.attachment) {
                    const filename = postFind.attachment.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        models.Post
                        .destroy({
                            where: { id: postFind.id }
                        })
                        .then(() => res.end())
                        .catch(err => res.status(500).json(err))
                    })
                }
                else {
                    models.Post
                    .destroy({
                        where: { id: postFind.id }
                    })
                    .then(() => res.end())
                    .catch(err => res.status(500).json(err))
                }
            })
            .catch(err => res.status(500).json(err))
        // Vérifier si l'utilisateur n'est pas autorisé de supprimer la publication
        } else {
        res.status(403).json("Vous n'êtes pas autorisé de supprimer cette publication !") }
    })
    .catch(error => res.status(500).json(console.log(error)));
}

// Likes
exports.reactToPost = (req, res, next) => {
    
    // Récupérer l'id utilisateur

    let userId = utils.getUserId(req.headers.authorization)

    models.UserReact.findOne({where: {PostId: req.params.id, UserId: userId}})

    // Vérifier si l'utilisateur a déjà aimé, sinon on crée un Like
    .then(userAlreadyReacted => {
        if (userAlreadyReacted) return toggleReact();
        addReact();
    
    // Fonctions de Likes

    // Fonction qui modifie l'état du Like
    function toggleReact() {
        if (req.body.like == 1) return toggleLike(); 
        toggleDislike(); // 
    };
   // Fonction qui modifie l'état du Like
    function toggleLike() {
        if (userAlreadyReacted.type === true) return removeLike(); 
        convertDislikeToLike(); 
    };
    // Fonction pour enlever le Like
    function removeLike() {
        userAlreadyReacted.destroy()
        .then(() => res.status(201).json({ message: 'Like retiré !' }))
        .catch(() => res.status(500).json(console.log('Suppression du Like impossible !')))
    };
    // Fonction pour remettre un Like après un dislike
    function convertDislikeToLike() {
        userAlreadyReacted.update({
            type: true
        })
        .then(() => res.status(201).json({ message: 'Dislike converti en Like !' }))
        .catch(() => res.status(500).json(console.log('Impossible de convertir le Dislike')))
    };
    // Fonction qui annule le like
    function toggleDislike() {
        if (userAlreadyReacted.type === false) return removeDislike(); 
        convertLikeToDisike(); 
    };
    // Fonction pour retirer le dislike
    function removeDislike() {
        userAlreadyReacted.destroy()
        .then(() => res.status(201).json({ message: 'Dislike retiré !' }))
        .catch(() => res.status(500).json(console.log('Suppression du Dislike impossible')))
    };
    // like => dislike
    function convertLikeToDisike() {
        userAlreadyReacted.update({
            type: false
        })
        .then(() => res.status(201).json({ message: 'Like => Dislike !' }))
        .catch(() => res.status(500).json(console.log('Dislike impossible !')))
    };
    // fonction pour créer un nouveau like
    function addReact() {
        if (req.body.like == 1) return addLike(); 
        addDislike(); };

    function addLike() {
        models.UserReact.create({
            PostId: req.params.id,
            UserId: userId,
            type: true
        })
        .then(() => res.status(201).json({ message: 'Like ajouté avec succès !' }))
        .catch(() => res.status(500).json(console.log('Ajout de Like impossible !')))
    };
    // Fonction pour créer un nouveau dislike
    function addDislike() {
        models.UserReact.create({
            PostId: req.params.id,
            UserId: userId,
            type: false
        })
        .then(() => res.status(201).json({ message: 'Dislike ajouté avec succès !' }))
        .catch(() => res.status(500).json(console.log('Ajout de Dislike impossible !')))
    };
    })
    .catch(error => res.status(500).json(console.log(error)))
},

//Ajouter des commentaires
exports.commentPost = (req, res) => {
    // Vérifier l'id utilisateur
    let id = utils.getUserId(req.headers.authorization)
    models.User.findOne({
        attributes: ['id', 'firstName', 'lastName'],
        where: { id: id }
    })
    .then(user => {
        if (user !== null) {
            let content = req.body.content;
            let postId = req.params.id;

            // Vérifier si le champ requis est renseigné
            if (content == 'null' ) {
                res.status(400).json({ error: 'Veuillez renseigner les chamos requis !' })
            // Création d'un commentaire
            } else{
                models.Comment.create({
                    content: content,
                    PostId: postId,
                    UserId: user.id
                })
                    .then((newComment) => {
                        res.status(201).json(newComment)
                    })
                    .catch((err) => {
                        res.status(500).json(err)
                    })
            } 
        } else {
            res.status(400).json(error);
        }
    })
    .catch(error => res.status(500).json(error));
},

//Suppression d'un commentaire
exports.deleteComment = (req, res) => {
    let userOrder = req.body.userIdOrder;
    
    // Vérifier l'id utilisateur
    let id = utils.getUserId(req.headers.authorization)
    models.User.findOne({
        attributes: ['id', 'email', 'firstName','lastName', 'isAdmin'],
        where: { id: id }
    })
    .then(user => {
        // Vérifier si l'utilisateur est autorisé de supprimer le commentaire
        if (user && (user.isAdmin == true || user.id == userOrder)) {
            console.log('Suppression du commentraire avec l Id :', req.params.comid);
            models.Comment
            .findOne({
                where: { id: req.params.comid }
            })
            .then((commentFind) => {
                models.Comment
                .destroy({
                    where: { id: commentFind.id }
                })
                .then(() => res.end())
                .catch(err => res.status(500).json(err))
            })
            .catch(err => res.status(500).json(err))
        // Vérifier si l'utilisateur n'est pas autorisé à supprimer le commentaire
        } else {
        res.status(403).json("Vous n'êtes pas autorisé à supprmer ce commentaire !") }
    })
    .catch(error => res.status(500).json(console.log(error)));
}