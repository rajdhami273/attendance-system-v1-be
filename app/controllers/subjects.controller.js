module.exports = function() {
  const Subjects = require("../models/subjects.model")();
  return {
    getSubjects: (req, res) => {
      Subjects.find({})
        .sort("createdAt")
        .then(data => {
          if (data) {
            return Promise.resolve(data);
          } else {
            return Promise.reject({
              status: 500,
              message: "Internal server error"
            });
          }
        })
        .then(d => res.send(d))
        .catch(err => res.status(500).send(err));
    },

    getSubjectsOfClass: (req, res) => {
      Subjects.find({ class: req.params.classId })
        .sort("createdAt")
        .then(data => {
          if (data) {
            return Promise.resolve(data);
          } else {
            return Promise.reject({
              status: 500,
              message: "Internal server error"
            });
          }
        })
        .then(d => res.send(d))
        .catch(err => res.status(500).send(err));
    },

    addSubjects: (req, res) => {
      const newSubjects = new Subjects(req.body);
      newSubjects
        .save()
        .then(data => {
          if (data) {
            return Promise.resolve(data);
          } else {
            return Promise.reject({
              status: 500,
              message: "Internal server error"
            });
          }
        })
        .then(d => res.send(d))
        .catch(err => res.status(500).send(err));
    },

    updateSubjects: (req, res) => {
      Subjects.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(data => {
          if (data) {
            return Promise.resolve(data);
          } else {
            return Promise.reject({
              status: 404,
              message: "Not found"
            });
          }
        })
        .then(d => res.send(d))
        .catch(err => res.status(500).send(err));
    },

    deleteSubjects: (req, res) => {
      Subjects.findByIdAndDelete(req.params.id)
        .then(data => {
          if (data) {
            return Promise.resolve(data);
          } else {
            return Promise.reject({
              status: 500,
              message: "Internal server error"
            });
          }
        })
        .then(d => res.send(d))
        .catch(err => res.status(500).send(err));
    }
  };
};
