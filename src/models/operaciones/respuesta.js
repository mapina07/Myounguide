const mongoose =require('mongoose');
const { Schema }=mongoose;

const RespuestaSchema= new Schema({
    texto:{ type:String, required: true},
    usuario:{ type:String, required: true},
    fechaHora:{ type:Date, required: true},
    tarea:{ type:String, required: true},
    adjuntos:[{type: Schema.Types.String}]
});

module.exports= mongoose.model('Respuesta', RespuestaSchema);