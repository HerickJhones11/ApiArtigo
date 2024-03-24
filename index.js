
const port = 3000;
const { configurarPacotes, connectDatabase } = require('./configure')
const { 
    inserirUsuario,
    obterUsuarios,
    inserirEstado,
    obterEstados,
    inserirAcertosPorCategoria,
    obterAcertosPorCategoria
 } = require('./function')

var app = configurarPacotes();

app.listen(port, () => {
    connectDatabase();
});

app.post('/InserirUsuario', async (req, res) => {
    try{
        var user = await inserirUsuario(req.body);
    }catch(e){
        res.status(400).send(e);
    }
    res.send(user);
});

app.get('/NotasUsuario', async (req, res) => {
    var usuarios = await obterUsuarios();
    res.json(usuarios);
});

app.post('/InserirEstado', async (req, res) => {
    try{
        var estado = await inserirEstado(req.body);
    }catch(e){
        res.status(400).send(e);
    }
    res.send(estado);
});

app.get('/NotasEstado', async (req, res) => {
    var estados = await obterEstados();
    res.json(estados);
});

app.post('/InserirAcertosPorCategoria', async (req, res) => {
    try{
        var acertosPorCategoria = await inserirAcertosPorCategoria(req.body);
    }catch(e){
        res.status(400).send(e);
    }
    res.send(acertosPorCategoria);
});

app.get('/AcertosPorCategoria', async (req, res) => {
    var acertosPorCategorias = await obterAcertosPorCategoria();
    res.json(acertosPorCategorias);
});
