const jwt = require("jsonwebtoken");
const tokenSecret = "ihatesecrets";
module.exports = function() {
  const User = require("../models/user.model")();

  return {
    getAll: (req, res) => {
      User.find({})
        .then(d => res.send(d))
        .catch(err => res.status(500).send(err));
    },
    createUser: (req, res) => {
      const emailReg = new RegExp(["^", req.body.email, "$"].join(""), "i");
      User.find({ email: emailReg })
        .then(data => {
          if (data.length > 0) {
            return Promise.reject({
              status: 400,
              message: "Entered `email` already exists"
            });
          } else {
            const user = new User(req.body);
            return user.save();
          }
        })
        .then(d => {
          if (d) {
            return Promise.resolve(d);
          } else {
            return Promise.reject({
              status: 500,
              message: "Server error"
            });
          }
        })
        .then(succ => res.send(succ))
        .catch(err => res.status(err.error.status || 500).send(err));
    },

    updateUser: (req, res) => {
      const emailReg = new RegExp(["^", req.body.email, "$"].join(""), "i");
      User.find({
        $match: {
          $and: [
            {
              email: {
                $eq: emailReg
              }
            },
            {
              _id: {
                $ne: req.params.id
              }
            }
          ]
        }
      })
        .then(data => {
          if (data.length > 0) {
            return Promise.reject({
              status: 400,
              message: "Entered `email` already exists"
            });
          } else {
            return User.findByIdAndUpdate(req.params.id, req.body, {
              new: true
            });
          }
        })
        .then(d => {
          if (d) {
            return Promise.resolve(d);
          } else {
            return Promise.reject({
              status: 500,
              message: "Server error"
            });
          }
        })
        .then(succ => res.send(succ))
        .catch(err => res.status(err.error.status || 500).send(err));
    },

    login: (req, res) => {
      const emailReg = new RegExp(["^", req.body.email, "$"].join(""), "i");
      User.find({ email: emailReg })
        .then(data => {
          if (data.length === 1) {
			  if (data[0].password === req.body.password) {
				  return Promise.resolve({
					  token: jwt.sign({ user: data[0]._id }, tokenSecret, {
						expiresIn: "48h"
					  }),
					  admin: data[0].admin
				  });
			  } else {
				return Promise.reject({
				  status: 400,
				  message: "Wrong password"
				});
          }
          } else {
            return Promise.reject({
              status: 500,
              message: "User not found"
            });
          }
        })
        .then(d => res.send(d))
        .catch(err => res.status(err.status || err.error.status || 500).send(err));
    },
	
	getUserByToken: (req, res) => {
		if(req.params.id) {
			User.findById(req.params.id)
			.then(data => {
			  if (data) {
				return Promise.resolve(data);
			  } else {
				return Promise.reject({
				  status: 500,
				  message: "User not found"
				});
			  }
			})
			.then(d => res.send(d))
			.catch(err => res.status(err.status || err.error.status || 500).send(err));
		} else{
			delete req.user.password;
			res.send(req.user);
		}
		
	},

    deleteUser: (req, res) => {
      User.findByIdAndDelete(req.params.id)
        .then(data => {
          if (data) {
            return Promise.resolve(data);
          } else {
            return Promise.reject({
              status: 500,
              message: "User not found"
            });
          }
        })
        .then(d => res.send(d))
        .catch(err => res.status(err.status || err.error.status || 500).send(err));
    }
  };
};
