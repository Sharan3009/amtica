const express = require('express');
const router = express.Router();
const userController = require("./../../app/controllers/userController");
const appConfig = require("./../../config/appConfig")

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users/`;

    // defining routes.

    // params: firstName, lastName, email, password
    app.post(`${baseUrl}signup/`, userController.signUpFunction);

    // params: email, password.
    app.post(`${baseUrl}login/`, userController.loginFunction);

    // auth token params: userId.
    app.post(`${baseUrl}logout/`, userController.logout);

}
