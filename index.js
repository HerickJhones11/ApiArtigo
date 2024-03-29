
const port = 3000;
const { configurarPacotes, connectDatabase } = require('./configure')
const { 
    questionRegistry,
    generateSpreadSheet,
    examRegistry,
    getExams,
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
