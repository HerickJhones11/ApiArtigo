var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// const acertosPorCategoriaSchema = new mongoose.Schema({
//   categoria:String,
//   acerto: Number,
//   estado: String,
//   mesSimulado: {
//     type: "Date",
//     validate: (value) => 
//     {
//       if(!(value instanceof Date)){
//         throw new Error("Password must not contain username")
//       }
//     }
//   }
// });

const categorySchema = new Schema({
  id: Number,
  name: String
}, {
  _id: false,
  primaryKey: 'id'
})
const questionSchema = new Schema({
  uf: {type: String, required: true, maxLength: 2},
  amount_right: Number,
  category_id: { type: Number, ref: 'Category'},
  amount_right: Number,
  amount_error: Number,
  period: {type: String, required: true, maxLength: 7},
});

const examSchema = new Schema({
  uf: {type: String, required: true, maxLength: 2},
  score: Number,
  period: {type: String, required: true, maxLength: 7},
})

const Category = mongoose.model('Category', categorySchema);
const Question = mongoose.model('Question', questionSchema);
const Exam = mongoose.model('Exam', examSchema);

module.exports = {
  Category,
  Question,
  Exam
}