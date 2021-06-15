const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Déclarer les routes publications, commentaires et likes
router.put("/:id", auth, multer, postCtrl.updatePost);
router.post("/new", auth, multer, postCtrl.createPost);
router.delete("/:id", auth, postCtrl.deletePost);
router.get("/", auth, postCtrl.getAllPosts);
router.get("/:id", auth, postCtrl.getOnePost);
router.post("/:id/react", auth, postCtrl.reactToPost);
router.post("/:id/comment", auth, postCtrl.commentPost);
router.delete("/:id/comment/:comid", auth, postCtrl.deleteComment);

module.exports = router; 