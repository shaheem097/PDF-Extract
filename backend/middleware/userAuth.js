const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const secretKey = 'd2365790aadbaef646d8825c53a3e3822447333cd0898f2d1df5854ffbaf8f9375d66c0156ed9a68f6432e84ea6de0d77424834ff57bedd55a4bd9b719b3fde3';

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (token) {
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        console.log("Not a valid token");
        return res.status(401).json({ status: false, message: "userTokenNotVerified" });
      }

      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ status: false, message: "userTokenNotVerified" });
  }
}

module.exports = authenticateToken;
