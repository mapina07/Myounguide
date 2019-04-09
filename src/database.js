const mongoose =require('mongoose');

mongoose.connect('mongodb://localhost/jwt',{ useNewUrlParser: true })
.then(db=>console.log('conected'))
.catch(err=>console.error(err));

module.exports= mongoose;