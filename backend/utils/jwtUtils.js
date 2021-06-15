// This file handles the jsonwebtoken creation and decoding

//import
let jwt = require('jsonwebtoken')

module.exports = {
  // Token creation
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
  // Token decoding to retrieve the id
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