const { Usuario, Estado, AcertosPorCategoria } = require('./Models')

module.exports = {
    inserirUsuario: async function(usuario) {
        const novoUsuario = new Usuario({
            nome: usuario.nome,
            estado: usuario.estado,
            nota: usuario.nota
        });
        try{
            await novoUsuario.save();
        }catch(e){
            throw e;
        }
        return novoUsuario;
    },
    obterUsuarios: async function(){
        return await Usuario.find();
    },
    inserirEstado: async function(estado) {
        const novoEstado = new Estado({
            estado: estado.estado,
            nota: estado.nota
        });
        try{
            await novoEstado.save();
        }catch(e){
            throw e;
        }
        return novoEstado;
    },
    obterEstados: async function(){
        return await Estado.find();
    },

    inserirAcertosPorCategoria: async function(acertosPorCategoria) {
        const novoAcertosPorCategoria = new AcertosPorCategoria({
            categoria: acertosPorCategoria.categoria,
            acerto: acertosPorCategoria.acerto,
            estado: acertosPorCategoria.estado,
            mesSimulado: acertosPorCategoria.mesSimulado
        });
        try{
            await novoAcertosPorCategoria.save();
        }catch(e){
            throw e;
        }
        return novoAcertosPorCategoria;
    },
    obterAcertosPorCategoria: async function(){
        return await AcertosPorCategoria.find();
    },

}
