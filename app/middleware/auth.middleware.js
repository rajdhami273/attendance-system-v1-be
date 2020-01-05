const jwt = require("jsonwebtoken");
const tokenSecret = "ihatesecrets";

module.exports = function() {
  const User = require("../models/user.model")();
  return (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(400).send({
        message: "Token not provided"
      });
    }
    const auth = req.headers.authorization;
    // console.log(auth);
    if (auth.split(" ")[0] === "JWT") {
      jwt.verify(auth.split(" ")[1], tokenSecret, (err, decoded) => {
        if (err) {
          return res.status(400).send({
            message: err.message || "Invalid token"
          });
        }
        User.findById(decoded.user)
          //   .populate("rolesAssigned")
          .then(user => {
            if (user) {
              if (
                user.classLinked.indexOf(req.params.id) > -1 ||
                user.classLinked.indexOf(req.body ? req.body.class : null) > -1 ||
                true
              ) {
                if (
                  req.params.classId &&
                  user.classLinked.indexOf(req.params.classId) === -1
                ) {
                  return Promise.reject({
                    status: 402,
                    message: "Not allowed"
                  });
                }
                req.user = user;
                next();
              } else {
                res.status(402).send({
                  message: "Not allowed"
                });
              }
            } else {
              res.status(400).send({
                message: "Invalid user"
              });
            }
          })
          .catch(err => {
            return res.status(500).send({
              message: err.message || "Unknown error occurred"
            });
          });
      });
    } else {
      res.status(400).send({
        message: "Invalid token"
      });
    }
  };
};
