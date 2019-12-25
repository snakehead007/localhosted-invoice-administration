import mongoose from 'mongoose';

export default async() => {
    mongoose.connect('mongodb://127.0.0.1:27017/sample-website'); //This is still on 'sample-website'. After automatisating all Data import and export, then will be changed
    mongoose.connection.on('open', () => {
        console.log('Mongoose connected!');
    });
    mongoose.connection.on('close', () => {
        console.log('Mongoose connection lost!');
    })
};