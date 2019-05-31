const express = require('express')
const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')

/* Models */
const UserModel = mongoose.model('User')

// User Signup function 
let signUpFunction = (req, res) => {

} 

// Login function 
let loginFunction = (req, res) => {
    
}

// Logout function.
let logout = (req, res) => {
  
}


module.exports = {

    signUpFunction: signUpFunction,
    loginFunction: loginFunction,
    logout: logout

}