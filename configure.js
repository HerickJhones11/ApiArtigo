const express = require('express')
var bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
require('dotenv').config();
var mongoose = require('mongoose');

module.exports = {
    configurarPacotes: function() {
        var app = express()

        app.use(bodyParser.urlencoded({ extended: false }))
        app.use(bodyParser.json())

        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

        return app;
    },
    connectDatabase: function() {
        var databaseName = "Artigo"
        const uri = process.env.DB_Connection
        mongoose.connect(uri).then(() => {
            console.log("Connected to MongoDB");
        }).catch(err => {
            console.error("Error connecting to MongoDB:", err);
        });
    },
}