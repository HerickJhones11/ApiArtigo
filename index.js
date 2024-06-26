
const port = 3000;
const { configurarPacotes, connectDatabase } = require('./configure')
const { 
    questionRegistry,
    examRegistry,
    getExams,
    cleanDatabase,
    questionQueryable,
    getCategoryData
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
});
app.get('/GetQuestions', async (req, res) => {
    var questionList = await questionQueryable();
    res.json(questionList);
})
app.post('/GetCategoryData', async (req, res) => {
    var periodo = req.body.periodo;
    var categoryData = await getCategoryData(periodo);
    res.json(categoryData);
    
});
