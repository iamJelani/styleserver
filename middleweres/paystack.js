const jwt = require("jsonwebtoken");
const User = require("../models/user");

const paystackAuth = async (req, res, next) => {
  try {
    const token = req.header(
      "sk_test_bf32db4917b3d3c664de7ac036c9e9c73ead384a"
    );
    if (!token)
      return res.status(401).json({ msg: "No auth token: Access Denied." });

    const verified = jwt.verify(token, "passwordKey");
    if (!verified)
      return res
        .status(401)
        .json({ msg: "Token verification failed, authorisation denied" });
    // const user = await User.findById(verified.id);
    // if (user.type == "user") {
    //   return res.status(402).json({ msg: "You are not an Admin" });
    // }

    req.user = verified.id;
    req.token = token;
    next();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
module.exports = paystackAuth;
