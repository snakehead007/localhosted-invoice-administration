const mongoose = require('mongoose');
const User = require('./user');

const Database = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }]
});

const database = mongoose.model('Database',Database);

exports.addUserIdToDatabase = (userId) => {
    Database.push(userId);
    Database.save();
};

module.exports = Database;
