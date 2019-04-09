const mongoose =require('mongoose');
const { Schema }=mongoose;

const TaskSchema= new Schema({
    denominacion:{ type:String, required: true},
    descripcion:{ type:String, required: true},
    category:{ type:String, required: true},
    estado:{ type:String, required: true},
    calificacion:{ type:Schema.Types.Number,required: false},
    adjuntos:[{type: Schema.Types.String}],
    fechaHora:{ type:Date, required: true}
});

module.exports= mongoose.model('Task', TaskSchema);