var mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nome: String,
    estado: String,
    nota: Number
});

const estadoSchema = new mongoose.Schema({
    estado: String,
    nota: Number
});

const acertosPorCategoriaSchema = new mongoose.Schema({
  categoria:String,
  acerto: Number,
  estado: String,
  mesSimulado: {
    type: "Date",
    validate: (value) => 
    {
      if(!(value instanceof Date)){
        throw new Error("Password must not contain username")
      }
    }
  }
});
  // Definir o modelo do dispositivo
const Usuario = mongoose.model('Usuario', usuarioSchema);
const Estado = mongoose.model('Estado', estadoSchema);
const AcertosPorCategoria = mongoose.model('AcertosPorCategoria', acertosPorCategoriaSchema);


module.exports = {
  Usuario: Usuario,
  Estado: Estado,
  AcertosPorCategoria,
}