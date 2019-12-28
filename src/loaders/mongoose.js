const mongoose = require('mongoose');
const dotenv = require('./dotenv.js');
module.exports.default = async() => {
    mongoose.connect(dotenv.URI); //This is still on 'sample-website'. After automatisating all Data import and export, then will be changed
    mongoose.connection.on('open', () => {
        console.log('Mongoose connected!');
    });
    mongoose.connection.on('close', () => {
        console.log('Mongoose connection lost!');
    })
};