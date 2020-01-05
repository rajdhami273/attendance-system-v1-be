const mongoose = require('mongoose');

const LectureSchema = mongoose.Schema({
    students: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        },
        
        attendance: {
            type: Boolean,
            require: true
        }
    }],

    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    },

    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    },

    startTime: {
        type: String,
        required: true
    },

    endTime: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        required: true
    }
},{
    timestamps: true
});

module.exports = function() {
    return mongoose.model('Lecture', LectureSchema);
}