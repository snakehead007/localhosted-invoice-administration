const mongoose = require('mongoose');
const Database = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }]
})
module.exports.default = mongoose.model('Database',Database);
