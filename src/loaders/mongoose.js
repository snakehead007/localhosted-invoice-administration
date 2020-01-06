const mongoose = require('mongoose');
module.exports.default = async() => {
    mongoose.connect(process.env.DB_URI); //This is still on 'sample-website'. After automatisating all Data import and export, then will be changed
    mongoose.connection.on('open', () => {
        console.log('Mongoose connected!');
    });
    mongoose.connection.on('close', () => {
        console.log('Mongoose connection lost!');
    })
};