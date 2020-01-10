const mongoose = require('mongoose');
module.exports.default = () => {
    mongoose.connect(process.env.DB_URI,{ useCreateIndex: true ,useUnifiedTopology: true ,useNewUrlParser: true}); //This is still on 'sample-website'. After automatisating all Data import and export, then will be changed
    mongoose.connection.on('open', () => {
        console.log('[Info]: Mongoose connected!');
    });
    mongoose.connection.on('close', () => {
        console.log('[Info]: Mongoose connection lost!');
    })
};