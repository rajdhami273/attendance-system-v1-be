const mongoose = require('mongoose');

const ClassSchema = mongoose.Schema({
    className: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

module.exports = function() {
    return mongoose.model('Class', ClassSchema);
}