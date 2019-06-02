const mongoose = require('mongoose')
const Schema = mongoose.Schema
const time = require('../libs/timeLib')

const authSchema = new Schema({
    userId : {
        type : String,
        unique:true
    },
    authToken : {
        type : String,
        index: true
    },
    tokenSecret : {
        type : String,
        required:true
    },
    tokenGenerationTime : {
        type : Date,
        default : time.now()
    }
})

module.exports = mongoose.model('Auth',authSchema)