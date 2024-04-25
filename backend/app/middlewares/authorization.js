// verify.token.js

const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.SECRET_TOKEN);
    const { role } = verified;
    // Kiểm tra vai trò của người dùng
    if (role !== true) {
      return res.status(403).send("Forbidden: Admin access only");
    }
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};
