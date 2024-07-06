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

module.exports = router;