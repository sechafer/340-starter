// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classValidate = require('../utilities/classification-validation')
const vehicleValidate = require('../utilities/vehicle-validation')

// // Route to building management view
router.get("/", utilities.checkAcountType, utilities.handleErrors(invController.buildManagement));
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build details of car view
router.get("/detail/:classificationId", utilities.handleErrors(invController.buildDetailsId));
// Route to build error 500
router.get("/error/:classificationId", utilities.handleErrors(invController.buildError));
// Route to build add-classification
router.get("/add_classification", utilities.checkAcountType, utilities.handleErrors(invController.addClassification));
// Route to build add-classification rules
router.post("/add_classification", utilities.checkAcountType, classValidate.classificationRules(), classValidate.checkClassData , utilities.handleErrors(invController.addNewClassification));

// Route to build add-vehicle
router.get("/add-vehicle", utilities.checkAcountType, utilities.handleErrors(invController.addInventory));

// Route to build add-vehicle
router.post("/add-vehicle", utilities.checkAcountType, vehicleValidate.vehicleRules(), vehicleValidate.checkVehicleData, utilities.handleErrors(invController.addNewVehicle));

// Route to JSON (injet table to innerHTML)
router.get("/getInventory/:classification_id", utilities.checkAcountType, utilities.checkLogin, utilities.handleErrors(invController.getInventoryJSON))

// Route to edit items information
router.get("/edit/:inv_id", utilities.checkAcountType, utilities.handleErrors(invController.editingItemsInformation))

//Route post update inventory
router.post("/update/", utilities.checkAcountType, vehicleValidate.vehicleRules(), vehicleValidate.chechUpdateData , utilities.handleErrors(invController.updateInventory))

// Route to delete (vehicle) information
router.get("/delete/:inv_id", utilities.checkAcountType, utilities.handleErrors(invController.deleteItemsInformation))

//Route post delete inventory
router.post("/delete/", utilities.checkAcountType, utilities.handleErrors(invController.deleteInventory))


module.exports = router;
