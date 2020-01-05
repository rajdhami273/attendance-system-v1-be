const studentsFromExcel = require("convert-excel-to-json");
module.exports = function() {
  const Students = require("../models/students.model")();
  return {
    getStudents: (req, res) => {
      Students.find({})
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
	
	getStudentsOfClass: (req, res) => {
      Students.find({class: req.params.classId})
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

    addStudents: (req, res) => {
      const newStudents = new Student(req.body);
      newStudent
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

    updateStudents: (req, res) => {
      Students.findByIdAndUpdate(req.params.id, req.body, { new: true })
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

    deleteStudents: (req, res) => {
      Students.findByIdAndDelete(req.params.id)
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

    addStudentsFromExcel: (req, res) => {
      const data = studentsFromExcel({
        sourceFile: `./public/assets/excelFiles/${req.params.class}.xlsx`,
        columnToKey: {
            A: 'rollNo',
            B: 'studentName'
        }
      });
      let actualData = data[`${req.params.class}`].map(e => {return {...e, class: req.params.classId}}).map(e => {return new Students(e)});
      if (actualData.length > 0) {
          Students.insertMany(actualData)
          .then(d => {
              return Promise.resolve(d);
          })
          .then(s => res.send(s))
          .catch(err => res.status(500).send(err));
      }
    }
  };
};
