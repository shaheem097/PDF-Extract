const databaseUrl = process.env.DATABASE_URL ;

const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect(databaseUrl)

mongoose.connection.once('open',()=>console.log('database connected')).on('error',error=>{
console.log(error);
})