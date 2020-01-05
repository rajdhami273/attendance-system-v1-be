const mongoose = require('mongoose');

const SubjectSchema = mongoose.Schema({
    subjectName: {
        type: String,
        required: true
    },

    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    }
},{
    timestamps: true
});

module.exports = function() {
    return mongoose.model('Subject', SubjectSchema);
}