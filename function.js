const fs = require('fs');;
const { Question, Exam } = require('./Models')
const ExcelJS = require('exceljs');

class ExcelGenerator {
    constructor(questionData, examData){
        this.questionData = questionData
        this.examData = examData
        this.workBook = new ExcelJS.Workbook();
        this.fileName = './collectedData.xlsx';
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
    generateQuestionData(excelGenerator);
    generateExamData(excelGenerator);

    return excelGenerator;
    // excelGenerator.workBook.xlsx.writeFile(fileName)
    // .then(() => {
    //     console.log('Arquivo Excel gerado com sucesso:', fileName);
    // })
    // .catch((error) => {
    //     console.error('Erro ao gerar arquivo Excel:', error);
    // });
}

async function updateQuestion(questionOrigin, question){
    questionOrigin.amount_right += question.amount_right;
    questionOrigin.amount_error += question.amount_error;
    try{
        await questionOrigin.save();
    }catch(e) {
        throw e;
    }
}
async function examQuestionsGroup(){
    return await Question.find({}).then(groupedResults => {
        return groupedResults;
    })
    .catch(error => {
        throw error
    });
}
module.exports = {
    questionRegistry: async function(question){
        await Question.findOne({
            category_id: question.category_id,
            uf: question.uf,
            period: question.period
        }).then(async questionOrigin => {
            if(questionOrigin){
                await updateQuestion(questionOrigin, question);
            }else{
                await createQuestion(question);
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
        return generateXLS(excelGenerator);
    },
    examRegistry: async function(questionList){
        var total_acertos = 0;
        var total_erros = 0;
        var periodo = parseInt(questionList[0].period, 10);
        var uf = questionList[0].uf;

        questionList.forEach(async question => {
            total_acertos += question.amount_right;
            total_erros += question.amount_error;
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
    },
    getExams: async function(){
        return await Exam.find({}).then(examList => {
            return examList;
        }, (error) => {
            throw error;
        });
    },
    cleanDatabase: async function() {
        await Exam.deleteMany({});
        await Question.deleteMany({});
    },
    questionQueryable: async function(){
        return await Question.find({}).then(questionList => {
            return questionList;
        }, (error) => {
            throw error;
        });
    },
    getCategoryData: async function(periodo) {
        filtro = {}
        if(periodo){
            filtro = { period: periodo }
        }
        return await Question.find(filtro).then(questionList => {
            return questionList;
        }, (error) => {
            throw error;
        });

    }

    
}
