const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/PDF_converter')

mongoose.connection.once('open',()=>console.log('database connected')).on('error',error=>{
console.log(error);
})