
const port = 3000;
const { configurarPacotes, connectDatabase } = require('./configure')
const { 
    questionRegistry,
    generateSpreadSheet,
    examRegistry,
    getExams,
    cleanDatabase
 } = require('./function')

var app = configurarPacotes();

app.listen(port, () => {
    connectDatabase();
});

app.post('/RegisterExam', async (req, res) => {
    var sucessMessage = "Dados coletados com sucesso. Gerando planilha no servidor";
    try{
        var questionList = req.body;
        await questionList.forEach(async q => {
            await questionRegistry(q)
        });
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
        await delay(1000);
        await examRegistry(questionList);
        generateSpreadSheet();
        return res.status(200).send(sucessMessage);
    }catch(e){
        return res.status(400).send(e.message);
    }
});

app.get('/GetExams', async (req, res) => {
    var usuarios = await getExams();
    res.json(usuarios);
});

app.get('/CleanDatabase', async (req, res) => {
    var sucessMessage = "Deletados com sucesso";
    if(process.env.NODE_ENV == "development"){
        try{
            await cleanDatabase();
            return res.status(200).send(sucessMessage);
        }catch(e){
            return res.status(400).send(e.message);
        }
    }
})
