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
// Process the login attempt
// router.post("/login", regValidate.loginRules(), regValidate.checkLoginData, utilities.handleErrors((req, res) => {res.status(200).send('login process')}))
router.post("/login", regValidate.loginRules(), regValidate.checkLoginData, utilities.handleErrors(accountController.accountLogin))

// Route to account view once login
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.accountManagment));

// Route to account information view
router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.accountInfomation));

// Route to update account information 
router.post("/update/", utilities.checkLogin, regValidate.changeInformationRules(), regValidate.checkUpdateData, utilities.handleErrors(accountController.updateAccountInfomation));

// Route to update account password 
router.post("/changepassword/", utilities.checkLogin, regValidate.changePasswordRules(), regValidate.checkPassowordData , utilities.handleErrors(accountController.updateAccountPassword));

// Route to update account password 
router.get("/logout", utilities.checkLogin, utilities.handleErrors(accountController.logout));

module.exports = router;