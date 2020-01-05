const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
// let { json2excel } = require("js2excel");
const json2xls = require("json2xls");
const fs = require("fs");
module.exports = function() {
  const Lectures = require("../models/lectures.model")();
  const Class = require("../models/class.model")();
  const Student = require("../models/students.model")();
  return {
    getLectures: (req, res) => {
      Lectures.find({})
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

    addLectures: (req, res) => {
      const newLectures = new Lectures(req.body);
      newLectures
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

    updateLectures: (req, res) => {
      Lectures.findByIdAndUpdate(req.params.id, req.body, { new: true })
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

    deleteLectures: (req, res) => {
      Lectures.findByIdAndDelete(req.params.id)
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

    getReport: (req, res) => {
      Student.aggregate()
        .match({ class: ObjectId(req.body.classId) })
        .lookup({
          from: mongoose.model("Subject").collection.collectionName,
          let: { cid: "$class", id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$class", "$$cid"]
                }
              }
            },
            {
              $sort: {
                createdAt: 1
              }
            },
            {
              $lookup: {
                from: mongoose.model("Lecture").collection.collectionName,
                let: {
                  cid: "$class",
                  sid: "$_id",
                  id: "$$id",
                  startDate: new Date(req.body.startDate),
                  endDate: new Date(req.body.endDate)
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ["$class", "$$cid"], //["$class", "$$cid"] "$$cid"
                            $eq: ["$subject", "$$sid"] //["$subject", "$$sid"] "$$sid"
                          },
                          {
                            $gte: [
                              {
                                $dateToString: {
                                  format: "%Y-%m-%d",
                                  date: "$date"
                                }
                              },
                              {
                                $dateToString: {
                                  format: "%Y-%m-%d",
                                  date: "$$startDate"
                                }
                              }
                            ]
                          },
                          {
                            $lte: [
                              {
                                $dateToString: {
                                  format: "%Y-%m-%d",
                                  date: "$date"
                                }
                              },
                              {
                                $dateToString: {
                                  format: "%Y-%m-%d",
                                  date: "$$endDate"
                                }
                              }
                            ]
                          }
                        ]
                      }
                    }
                  },
                  {
                    $project: {
                      studentAttendanceRecord: {
                        $filter: {
                          input: "$students",
                          as: "student",
                          cond: {
                            $and: [
                              {
                                $eq: ["$$student.student", "$$id"]
                              }
                            ]
                          }
                        }
                      },
                      _id: 0
                    }
                  },
                  {
                    $unwind: "$studentAttendanceRecord"
                  }
                ],
                as: "lectureDetails"
              }
            },
            {
              $project: {
                subjectName: 1,
                lectureDetails: 1,
                noOfLecturesTotal: {
                  $cond: {
                    if: {
                      $isArray: "$lectureDetails"
                    },
                    then: {
                      $size: "$lectureDetails"
                    },
                    else: 0
                  }
                },
                noOfLecturesPresent: {
                  $reduce: {
                    input: "$lectureDetails",
                    initialValue: 0,
                    in: {
                      $sum: [
                        "$$value",
                        {
                          $cond: {
                            if: {
                              $eq: [
                                "$$this.studentAttendanceRecord.attendance",
                                true
                              ]
                            },
                            then: 1,
                            else: 0
                          }
                        }
                      ]
                    }
                  }
                }
              }
            }
          ],
          as: "classDetails"
        })
        .addFields({
          totalLectures: {
            $reduce: {
              input: "$classDetails",
              initialValue: 0,
              in: {
                $sum: ["$$value", "$$this.noOfLecturesTotal"]
              }
            }
          },
          totalLecturesPresent: {
            $reduce: {
              input: "$classDetails",
              initialValue: 0,
              in: {
                $sum: ["$$value", "$$this.noOfLecturesPresent"]
              }
            }
          }
        })
        .project({
          "classDetails.lectureDetails": 0
        })
        .then(data => {
          let newData;
          newData = data.map((item, index) => {
            let d = {};
            d = {
              "Roll no": item.rollNo,
              "Student Name": item.studentName,
            };
            item.classDetails.map(item1 => {
              d[`${item1.subjectName}`] = item1.noOfLecturesPresent;
              d[`${item1.subjectName} Total`] = item1.noOfLecturesTotal;
            });
            d = {
              ...d,
              "Total Lectures Present": item.totalLecturesPresent,
              "Total Lectures": item.totalLectures,
              "%": ((item.totalLecturesPresent/item.totalLectures)*100).toFixed(2)
            };
            return d;
          });

          let excel = json2xls(newData);
          fs.writeFileSync('public/assets/excelFiles/data.xlsx', excel, 'binary')
          // json2excel({ newData, name: "download", formateDate: "yyyy/mm/dd" })
          //   .then(() => {
          //     return Promise.resolve({ data, newData });
          //   })
          //   .catch(err => {return console.log(err)});
          return Promise.resolve({ data, fileUrl: 'http://localhost:3000/downloads/assets/excelFiles/data.xlsx' });
        })
        .then(d => res.send(d))
        .catch(err => res.status(500).send(err));
    }
  };
};
