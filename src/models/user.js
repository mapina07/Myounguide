const mongoose =require('mongoose');
const { Schema }=mongoose;

const UserSchema= new Schema({
    nombre:{ type:String, required: true},
    password:{ type:String, required: true},
    email:{ type:String, required: true},
    rol:{ type:String, required: true},
    categories:[{type: Schema.Types.ObjectId, ref: 'Category'}],
    tasks:[{type: String}]
});

module.exports= mongoose.model('User', UserSchema);