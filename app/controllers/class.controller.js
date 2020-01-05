module.exports = function() {
    const Class = require('../models/class.model')();
    return {
        getClass: (req, res) => {
            Class.find({})
            .then(data => {
                if (data) {
                    return Promise.resolve(data);
                } else {
                    return Promise.reject({
                        status: 500,
                        message: 'Internal server error'
                    });
                }
            })
            .then(d => res.send(d))
            .catch(err => res.status(500).send(err));
        },

        addClass: (req, res) => {
            const newClass = new Class(req.body);
            newClass.save()
            .then(data => {
                if (data) {
                    return Promise.resolve(data);
                } else {
                    return Promise.reject({
                        status: 500,
                        message: 'Internal server error'
                    });
                }
            })
            .then(d => res.send(d))
            .catch(err => res.status(500).send(err));
        },

        updateClass: (req, res) => {
            Class.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then(data => {
                if (data) {
                    return Promise.resolve(data);
                } else {
                    return Promise.reject({
                        status: 404,
                        message: 'Not found'
                    });
                }
            })
            .then(d => res.send(d))
            .catch(err => res.status(500).send(err));
        },

        deleteClass: (req, res) => {
            Class.findByIdAndDelete(req.params.id)
            .then(data => {
                if (data) {
                    return Promise.resolve(data);
                } else {
                    return Promise.reject({
                        status: 500,
                        message: 'Internal server error'
                    });
                }
            })
            .then(d => res.send(d))
            .catch(err => res.status(500).send(err));
        }
    }
}