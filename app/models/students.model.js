const mongoose = require('mongoose');

const StudentSchema = mongoose.Schema({
    studentName: {
        type: String,
        required: true
    },

    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    },

    rollNo: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

module.exports = function() {
    return mongoose.model('Student', StudentSchema);
}