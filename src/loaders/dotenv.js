const express = require("express");
const dotenv = require("dotenv");
const config = require("config");
const cors = require("cors");

module.exports.default =  async function( app ) {
    dotenv.config();
    module.exports.PORT = process.env.PORT || 5000;
    if(!process.env.DB_URI) throw new Error("No DB_URI set in .env file");
    module.exports.URI = process.env.DB_URI;
    app.use(cors());
};