// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classValidate = require('../utilities/classification-validation')
const vehicleValidate = require('../utilities/vehicle-validation')

// // Route to building management view
router.get("/", utilities.checkLogin, utilities.checkAcountType, utilities.checkAcountAdmin, utilities.handleErrors(invController.buildManagement));
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build details of car view
router.get("/detail/:classificationId", utilities.handleErrors(invController.buildDetailsId));
// Route to build error 500
router.get("/error/:classificationId", utilities.handleErrors(invController.buildError));
// Route to build add-classification
router.get("/add_classification", utilities.checkAcountType, utilities.handleErrors(invController.addClassification));
// Route to build add-classification rules
router.post("/add_classification", utilities.checkAcountType, utilities.checkAcountAdmin, classValidate.classificationRules(), classValidate.checkClassData , utilities.handleErrors(invController.addNewClassification));

// Route to build add-vehicle
router.get("/add-vehicle", utilities.checkAcountType, utilities.handleErrors(invController.addInventory));

// Route to build add-vehicle
router.post("/add-vehicle", utilities.checkAcountType, utilities.checkAcountAdmin, vehicleValidate.vehicleRules(), vehicleValidate.checkVehicleData, utilities.handleErrors(invController.addNewVehicle));

// Route to JSON (injet table to innerHTML)
router.get("/getInventory/:classification_id", utilities.checkAcountType, utilities.checkLogin, utilities.handleErrors(invController.getInventoryJSON))

// Route to edit items information
router.get("/edit/:inv_id",utilities.checkLogin,  utilities.checkAcountType, utilities.checkAcountAdmin, utilities.handleErrors(invController.editingItemsInformation))

//Route post update inventory
router.post("/update/",utilities.checkLogin,  utilities.checkAcountType, utilities.checkAcountAdmin, vehicleValidate.vehicleRules(), vehicleValidate.chechUpdateData , utilities.handleErrors(invController.updateInventory))

// Route to delete (vehicle) information
router.get("/delete/:inv_id",utilities.checkLogin, utilities.checkAcountType, utilities.checkAcountAdmin, utilities.handleErrors(invController.deleteItemsInformation))

//Route post delete inventory
router.post("/delete/",utilities.checkLogin,  utilities.checkAcountType, utilities.checkAcountAdmin, utilities.handleErrors(invController.deleteInventory))


// Rout to Pending approvals
router.get("/pending-approves/",utilities.checkLogin, utilities.checkAcountType, utilities.checkAcountAdmin, utilities.handleErrors(invController.approve))

//Route approved cassification view
router.get("/approve/:classification_id",utilities.checkLogin, utilities.checkAcountType, utilities.checkAcountAdmin, utilities.handleErrors(invController.approveClass))

//Route approved cassification
router.post("/approve/",utilities.checkLogin, utilities.checkAcountType, utilities.checkAcountAdmin, utilities.handleErrors(invController.approvedClassification))

//Route reject cassification view
router.get("/reject/:classification_id",utilities.checkLogin, utilities.checkAcountType, utilities.checkAcountAdmin, utilities.handleErrors(invController.rejectClass))

//Route reject cassification
router.post("/reject/",utilities.checkLogin, utilities.checkAcountType, utilities.checkAcountAdmin, utilities.handleErrors(invController.rejectClassification))
//-----------------------------------------------
//Route approved Inventory view
router.get("/approve-inv/:inv_id",utilities.checkLogin, utilities.checkAcountType, utilities.checkAcountAdmin, utilities.handleErrors(invController.approveInv))

//Route approved Inventory
router.post("/approve-inv/",utilities.checkLogin, utilities.checkAcountType, utilities.checkAcountAdmin, utilities.handleErrors(invController.approvedInventory))

//Route reject Inventory view
router.get("/reject-inv/:inv_id",utilities.checkLogin, utilities.checkAcountType, utilities.checkAcountAdmin, utilities.handleErrors(invController.rejectInv)) // todo today 

//Route reject Inventory
router.post("/reject-inv/",utilities.checkLogin, utilities.checkAcountType, utilities.checkAcountAdmin, utilities.handleErrors(invController.rejectInventory))



//Route approved inventory
// router.post("/reject/", utilities.checkAcountType, utilities.handleErrors(invController.deleteInventory))

module.exports = router;