const mongoose =require('mongoose');
const { Schema }=mongoose;

const CategorySchema= new Schema({
    denominacion:{ type:String, required: true}
});

module.exports= mongoose.model('Category', CategorySchema);