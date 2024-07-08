// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

// Route to build account view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to register account view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to register new user
router.post("/register", regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))
<<<<<<< HEAD
// Process the login attempt
router.post("/login", regValidate.loginRules(), regValidate.checkLoginData, utilities.handleErrors((req, res) => {res.status(200).send('login process')}))

=======
<<<<<<< HEAD
// Process the login attempt
router.post("/login", regValidate.loginRules(), regValidate.checkLoginData, utilities.handleErrors((req, res) => {res.status(200).send('login process')}))

=======

// Process the login attempt
router.post("/login", regValidate.loginRules(), regValidate.checkLoginData, utilities.handleErrors((req, res) => {res.status(200).send('login process')}))
>>>>>>> main
>>>>>>> 7fae5ecec95e880afce0b6e519aeafc25e5b4b14
module.exports = router;