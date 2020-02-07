const mongoose = require('mongoose');

const Project = new mongoose.Schema({
    fromUser: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }
});

const project = mongoose.model('Project',Project);

module.exports = project;
