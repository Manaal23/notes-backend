const jwt = require("jsonwebtoken");

const genToken = (user) => {
  const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

module.exports = genToken;
