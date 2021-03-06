const express = require('express')
const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib');
const passwordLib = require('../libs/generatePasswordLib');
const token = require('../libs/tokenLib');

/* Models */
const UserModel = mongoose.model('User');
const AuthModel = mongoose.model('Auth')

// User Signup function 
let signUpFunction = (req, res) => {
    let validateUserInput = () =>{
        return new Promise((resolve,reject)=>{
            if(req.body.email){
                if(!validateInput.Email(req.body.email)){
                    let apiResponse = response.generate(true,'Email Does not meet the requirement',400,null)
                    reject(apiResponse)
                } else if(!validateInput.Password(req.body.password)){
                    let apiResponse = response.generate(true,'Password must be atleast 8 characters',400,null)
                    reject(apiResponse)
                }
                 else if (check.isEmpty(req.body.password)){
                    let apiResponse = response.generate(true,'password parameter is missing',400,null)
                    reject(apiResponse)
                } else {
                    resolve()
                }
            } else {
                logger.error('Field Missing during User creation','User Controller : validateUserInput' , 5)
                let apiResponse = response.generate(true,'Email or Password is missing',400,null)
                reject(apiResponse)
            }
        })
    }

    let createUser = () =>{
        return new Promise((resolve,reject)=>{
            UserModel.findOne({email:req.body.email})
            .exec((err, retrievedUserDetails)=>{
                if(err){
                    logger.error(err.message,'User Controller : createUser',5)
                    let apiResponse = response.generate(true,'Failed to create User',500,null)
                    reject(apiResponse)
                } else if (check.isEmpty(retrievedUserDetails)) {
                    let newUser = new UserModel({
                        userId : shortid.generate(),
                        firstName : req.body.firstName,
                        lastName : req.body.lastName || '',
                        email : req.body.email.toLowerCase(),
                        password : passwordLib.hashpassword(req.body.password),
                        createdOn : time.now()
                    })
                    newUser.save((err,newUser)=>{
                        if(err){
                            console.log(err)
                            logger.error(err.message,'User Controller : createUser', 10)
                            let apiResponse = response.generate(true,'Failed to create new user',500,null)
                            reject(apiResponse)
                        } else {
                            // delete keyword will not working until you convert it to js object using toObject()
                            let newUserObj = newUser.toObject()
                            resolve(newUserObj)
                        }
                    })
                } else {
                    logger.info('User cannot be created. User already present','User Controller : createUser',5)
                    let apiResponse = response.generate(true,'User already present with this email',403,null)
                    reject(apiResponse)
                } 
            })
        })
    }
    validateUserInput(req,res)
    .then(createUser)
    .then((resolve)=>{
        delete resolve.password
        delete resolve._id
        delete resolve.__v
        let apiResponse = response.generate(false,'User created',200,resolve)
        res.send(apiResponse)
    })
    .catch((err)=>{
        console.log(err)
        res.send(err)
    })
} 

// Login function 
let loginFunction = (req, res) => {
    let findUser = () => {
        return new Promise((resolve,reject)=>{
            if(req.body.email){
                UserModel.findOne({email: req.body.email.toLowerCase()},(err,userDetails)=>{
                    if(err){
                        console.log(err)
                        logger.error('Failed to Retrieve User Data', 'User Controller : findUser',5)
                        let apiResponse = response.generate(true,'Failed to find the user',500,null)
                        reject(apiResponse)
                    } else if (check.isEmpty(userDetails)) {
                        logger.error('No User Found','User Controller : findUser',5)
                        let apiResponse = response.generate(true,'No User Details Found',400,null)
                        reject(apiResponse)
                    } else {
                        logger.info('User Found','User Controller : findUser',5)
                        resolve(userDetails)
                    }
                })
            } else {
                let apiResponse = response.generate(true,'email parameter is missing',400,null)
                reject(apiResponse)
            }
        })
    }

    let validatePassword = (retrievedUserDetails) => {
        return new Promise((resolve,reject)=>{
            passwordLib.comparePassword(req.body.password,retrievedUserDetails.password,(err,isMatch)=>{
                if(err){
                    console.log(err)
                    logger.error(err.message,'User Controller : validatePassword',5)
                    let apiResponse = response.generate(true,'Login Failed',500,null)
                    reject(apiResponse)
                } else if (isMatch) {
                    let retrievedUserDetailsObj = retrievedUserDetails.toObject()
                    delete retrievedUserDetailsObj.password
                    delete retrievedUserDetailsObj._id
                    delete retrievedUserDetailsObj.__v
                    delete retrievedUserDetailsObj.createdOn
                    resolve(retrievedUserDetailsObj)
                } else {
                    logger.error('Login failed due to incorrect password','User Controller : validatePassword',5)
                    let apiResponse = response.generate(true,'Wrong password . Login Failed',401,null)
                    reject(apiResponse)
                }
            })
           
        })
    }

    let generateToken = (userDetails) => {
        return new Promise ((resolve,reject)=>{
            token.generateToken(userDetails,(err,tokenDetails)=>{
                if(err){
                    console.log(err)
                    let apiResponse = response.generate(true,'Failed to generate token',500,null)
                    reject(apiResponse)
                } else {
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    resolve(tokenDetails)
                }
            })
        })
    }

    let saveToken = (tokenDetails) => {
        return new Promise((resolve,reject)=>{
            AuthModel.findOne({userId : tokenDetails.userId })
            .exec((err, retrievedTokenDetails)=>{
                if(err){
                    logger.error(err.message,'User Controller : saveToken',5)
                    let apiResponse = response.generate(true,'Failed to generate token',500,null)
                    reject(apiResponse)
                } else if (check.isEmpty(retrievedTokenDetails)) {
                    let newAuthToken = new AuthModel({
                        userId : tokenDetails.userId,
                        authToken : tokenDetails.token,
                        tokenSecret : tokenDetails.tokenSecret,
                        tokenGenerationTime : time.now()
                    })
                    newAuthToken.save((err,newTokenDetails)=>{
                        if(err){
                            console.log(err)
                            logger.error(err.message,'User Controller : saveToken', 10)
                            let apiResponse = response.generate(true,'Failed to save new token',500,null)
                            reject(apiResponse)
                        } else {
                            res.cookie("auth_token",newTokenDetails.authToken);
                            let responseBody = tokenDetails.userDetails;
                            resolve(responseBody)
                        }
                    })
                } else {
                    retrievedTokenDetails.authToken = tokenDetails.token
                    retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret
                    retrievedTokenDetails.tokenGenerationTime = time.now()
                    retrievedTokenDetails.save((err,newTokenDetails)=>{
                        if(err){
                            console.log(err)
                            logger.error(err.message,'User Controller : saveToken',10)
                            let apiResponse = response.generate(true,'Failed to save Token',500,null)
                            reject(apiResponse)
                        } else {
                            res.cookie("auth_token",newTokenDetails.authToken);
                            let responseBody = tokenDetails.userDetails;
                            resolve(responseBody)
                        }
                    })
                } 
            })
        })
    }

    findUser(req,res)
    .then(validatePassword)
    .then(generateToken)
    .then(saveToken)
    .then((resolve)=>{
        let apiResponse = response.generate(false,'Successfully login',200,resolve)
        res.send(apiResponse)
    })
    .catch((err)=>{
        console.log(err)
        res.send(err)
    })
}

let ifLoggedIn = (req, res) => {
    let ifCookieExist=()=>{
        return new Promise((resolve,reject)=>{
            let cookie = req.cookies["auth_token"];
            if(cookie){
                AuthModel.findOne({authToken : cookie })
                .exec((err, retrievedTokenDetails)=>{
                    if(err){
                        logger.error(err.message,'User Controller : ifCookieExist',5)
                        let apiResponse = response.generate(true,'Failed to find token',500,null)
                        reject(apiResponse)
                    } else if (check.isEmpty(retrievedTokenDetails)) {
                        logger.error("No Token details found",'User Controller : ifCookieExist',5)
                        let apiResponse = response.generate(true,'Failed to find token',500,null)
                        reject(apiResponse)
                    } else {
                        resolve(retrievedTokenDetails.userId);
                    } 
                })
            } else {
                logger.error("Cookie does not exist",'User Controller : ifCookieExist',5)
                let apiResponse = response.generate(true,'cookie is empty',500,null)
                reject(apiResponse)
            }
        })
    }

    let getUserDetails=(userId)=>{
        return new Promise((resolve,reject)=>{
            UserModel.findOne({userId: userId},(err,userDetails)=>{
                if(err){
                    console.log(err)
                    logger.error('Failed to Retrieve User Data', 'User Controller : getUserDetails',5);
                    let apiResponse = response.generate(true,'Failed to find the user',500,null);
                    reject(apiResponse);
                } else if (check.isEmpty(userDetails)) {
                    logger.error('No User Found','User Controller : getUserDetails',5);
                    let apiResponse = response.generate(true,'No User Details Found',400,null);
                    reject(apiResponse);
                } else {
                    logger.info('User Found','User Controller : getUserDetails',5);
                    let userDetailsObj = userDetails.toObject();
                    delete userDetailsObj.password;
                    delete userDetailsObj._id;
                    delete userDetailsObj.__v;
                    resolve(userDetailsObj);
                }
            })
        })
    }
    ifCookieExist(req,res)
    .then(getUserDetails)
    .then((resolve)=>{
        let apiResponse = response.generate(false,'User exists',200,resolve)
        res.send(apiResponse)
    })
    .catch((err)=>{
        console.log(err)
        res.send(err)
    })
}

// Logout function.
let logout = (req, res) => {
    AuthModel.deleteOne({ authToken: req.cookies["auth_token"] },(err,result)=>{
        if(err) {
            console.log(err)
            logger.error(err.message , 'User Controller : logout',10)
            let apiResponse = response.generate(true,`error occured : ${err.message}`,500,null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            let apiResponse = response.generate(true,'Already logged out or invalid user',404,null)
            res.send(apiResponse)
        } else {
            res.clearCookie("auth_token");
            let apiResponse = response.generate(false,'Logged out successfully',200,result)
            res.send(apiResponse)
        }
    })
}


module.exports = {

    signUpFunction: signUpFunction,
    loginFunction: loginFunction,
    ifLoggedIn: ifLoggedIn,
    logout: logout

}