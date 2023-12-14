const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pdfSchema = new Schema({
    userId:String,
    title:String,
    Extracted:Boolean,
    url:String
   
   
})

module.exports = mongoose.model('pdf',pdfSchema)
