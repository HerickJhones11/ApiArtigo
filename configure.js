const express = require('express')
var bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express');
// const YAML = require('yamljs');
// const swaggerDocument = YAML.load('./swagger.yaml');
const dotenv = require('dotenv');
const envFile = '.env';
dotenv.config({ path: envFile });
var mongoose = require('mongoose');

module.exports = {
    configurarPacotes: function() {
        var app = express()

        app.use(bodyParser.urlencoded({ extended: false }))
        app.use(bodyParser.json())

        // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

        return app;
    },
    connectDatabase: function() {
        var connectionString;
        if(process.env.NODE_ENV == "development"){
            connectionString = process.env.DB_Connection_Development
        }else{
            connectionString = process.env.DB_Connection
        }
        const uri = connectionString;
        mongoose.connect(uri).then(() => {
            console.log("Connected to MongoDB");
        }).catch(err => {
            console.error("Error connecting to MongoDB:", err);
        });
    },
}