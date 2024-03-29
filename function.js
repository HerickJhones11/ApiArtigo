const fs = require('fs');;
const { Question, Exam } = require('./Models')
const ExcelJS = require('exceljs');

class ExcelGenerator {
    constructor(questionData, examData){
        this.questionData = questionData
        this.examData = examData
        this.workBook = new ExcelJS.Workbook();
    }
}
async function createQuestion(question){
    const newQuestion = new Question({
        category_id: question.category_id,
        uf: question.uf,
        period: question.period,
        amount_right: question.amount_right,
        amount_error: question.amount_error
    });
    try{
        await newQuestion.save();
    }catch(e){
        throw e;
    }
}
function generateQuestionData(excelGenerator){
    var questionData = excelGenerator.questionData;

    if (!questionData || questionData.length === 0) {
        console.error('Erro: questionData está vazio ou não definido.');
        return;
    }
    const workSheetName = "Questions Data";
    const workSheet = excelGenerator.workBook.addWorksheet(workSheetName);

    workSheet.columns = [
        { header: 'UF', key: 'UF', width: 10 },
        { header: 'Period', key: 'period', width: 15 },
        { header: 'Category ID', key: 'category_id', width: 15 },
        { header: 'Amount Error', key: 'amt_error', width: 15 },
        { header: 'Amount Right', key: 'amt_right', width: 15 }
    ];
    questionData.forEach(q => {
        workSheet.addRow({ 
            UF: q.uf,
            period: q.period,
            category_id: q.category_id,
            amt_error: q.amount_error,
            amt_right: q.amount_right 
        });
    });
}
function generateExamData(excelGenerator){
    var examData = excelGenerator.examData;

    if (!examData || examData.length === 0) {
        console.error('Erro: examData está vazio ou não definido.');
        return;
    }
    const workSheetName = "Exams Data";
    const workSheet = excelGenerator.workBook.addWorksheet(workSheetName);

    workSheet.columns = [
        { header: 'UF', key: 'uf', width: 10 },
        { header: 'Period', key: 'period', width: 15 },
        { header: 'Score', key: 'score', width: 15 },
    ];
    examData.forEach(e => {
        workSheet.addRow({ 
            uf: e.uf,
            period: e.period,
            score: e.score,
        });
    });
}
function generateXLS(excelGenerator) {
    const fileName = './collectedData.xlsx';
    
    generateQuestionData(excelGenerator);
    generateExamData(excelGenerator);
    excelGenerator.workBook.xlsx.writeFile(fileName)
    .then(() => {
        console.log('Arquivo Excel gerado com sucesso:', fileName);
    })
    .catch((error) => {
        console.error('Erro ao gerar arquivo Excel:', error);
    });
}
function generateSpreadSheet(questionData){
    const fileName = `./collectedData.csv`;

    const table = "question";
    const workBook = new ExcelJS.Workbook();
    const workSheet = workBook.addWorksheet(table)

    questionData.forEach(q => {
        workSheet.addRow({ 
            UF: q.uf,
            period: q.period,
            category_id: q.category_id,
            amt_error: q.amount_error,
            amt_right: q.amount_right 
        });
    });
    workSheet.columns = [
        { header: 'UF', key: 'UF', width: 10 },
        { header: 'period', key: 'period', width: 15 },
        { header: 'category_id', key: 'category_id', width: 15 },
        { header: 'amt_right', key: 'amt_right', width: 15 },
        { header: 'amt_error', key: 'amt_error', width: 15 }
    ]
    workBook.xlsx.writeFile(fileName)
    .then(() => {
        console.log('Arquivo Excel gerado com sucesso:', fileName);
    })
    .catch((error) => {
        console.error('Erro ao gerar arquivo Excel:', error);
    }); 
}
function updateQuestion(questionOrigin, question){
    questionOrigin.amount_right += question.amount_right;
    questionOrigin.amount_error += question.amount_error;
    try{
        questionOrigin.save();
    }catch(e) {
        throw e;
    }
}
function examQuestionsGroup(){
    return Question.find({}).then((result) => {
        return Question.aggregate([
            {
                $group: {
                    _id: { estado: '$uf', periodo: '$period' }, // Chave de agrupamento
                    documentos: { $push: '$$ROOT' } // Array com os documentos agrupados
                }
            }
        ])
    }).then(groupedResults => {
        return groupedResults;
    })
    .catch(error => {
        throw error
    });
}
module.exports = {
    questionRegistry: async function(question){
        Question.findOne({
            category_id: question.category_id,
            uf: question.uf,
            period: question.period
        }).then(questionOrigin => {
            if(questionOrigin){
                updateQuestion(questionOrigin, question);
            }else{
                createQuestion(question);
            }
        }).catch(error => {
            throw error;
        });
    },
    generateSpreadSheet: async function(){
        var questionData = await Question.find({}).then(questionList => {
            return questionList;
        }, (error) => {
            throw error;
        });

        var examData = await Exam.find({}).then(examList => {
            return examList;
        }, (error) => {
            throw error;
        });
        var excelGenerator = new ExcelGenerator(questionData, examData)
        generateXLS(excelGenerator);
    },
    examRegistry: async function(){
        var questionsExam = await examQuestionsGroup()
        questionsExam.forEach(async questionList => {
            var total_acertos = 0;
            var total_erros = 0;
            var periodo = parseInt(questionList._id.periodo, 10);
            var uf = questionList._id.estado;
            questionList.documentos.forEach(q => {
                total_acertos += q.amount_right;
                total_erros += q.amount_error;
            });
            var score = (total_acertos/(total_acertos + total_erros)) * 1000;
            const newExam = new Exam({
                uf: uf,
                period: periodo,
                score: score,
            });
            try{
                await newExam.save();
            }catch(e){
                throw e;
            }
        });
    },
    getExams: async function(){
        return await Exam.find({}).then(examList => {
            return examList;
        }, (error) => {
            throw error;
        });
    }
    
}
