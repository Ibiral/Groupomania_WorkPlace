const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Déclarer les routes utilisateur
router.post("/signup", multer, userCtrl.signup);
router.post("/login", userCtrl.login);
router.get('/me', auth, userCtrl.getUserProfile);
router.put('/update', auth, multer, userCtrl.updateProfile);
router.delete('/delete', auth, userCtrl.deleteProfile);


module.exports = router;