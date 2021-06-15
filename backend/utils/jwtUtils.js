// Gestion des tokens
let jwt = require('jsonwebtoken')

module.exports = {
  // Création du token
  tokenSign : process.env.TOKEN,
  generateToken: function (user) {
    return jwt.sign({
      userId: user.id,
      isAdmin: user.isAdmin
    },
      this.tokenSign,
      {
        expiresIn: '8h'
      })
  },
  // Récupération de l'id utilisateur
  getUserId: function (data) {
    if (data.length > 1) {
      let token = data.split(' ')[1];
      try {
        let decodedToken = jwt.verify(token, this.tokenSign)
        userId = decodedToken.userId
        return userId
      }
      catch (err) {
        return err
      }
    };
  }
}