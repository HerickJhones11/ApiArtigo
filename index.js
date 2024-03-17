const express = require('express')
const { Pool } = require('pg');
var bodyParser = require('body-parser')

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');


require('dotenv').config();
var app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = 3000

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    }
})

app.get('/', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM usuario');
        const results = { 'results': (result) ? result.rows : null };
        res.json(results);
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Erro ao buscar dados");
    }
});

async function inserirUsuario(usuario) {
    try {
        const client = await pool.connect();
        const query = 'INSERT INTO usuario (nome, estado) VALUES ($1, $2) RETURNING *';
        const values = [usuario.nome, usuario.estado];
        const result = await client.query(query, values);
        console.log('Inserção bem-sucedida:', result.rows[0]);
        client.release();
    } catch (error) {
        console.error('Erro ao inserir:', error);
    }
}
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.post('/usuario', (req, res) => {
    inserirUsuario(req.body);
    res.send(req.body);
});