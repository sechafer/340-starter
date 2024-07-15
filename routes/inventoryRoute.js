// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classValidate = require('../utilities/classification-validation')
const vehicleValidate = require('../utilities/vehicle-validation')

// // Route to building management view
router.get("/", utilities.handleErrors(invController.buildManagement));
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build details of car view
router.get("/detail/:classificationId", utilities.handleErrors(invController.buildDetailsId));
// Route to build error 500
router.get("/error/:classificationId", utilities.handleErrors(invController.buildError));
// Route to build add-classification
router.get("/add_classification", utilities.handleErrors(invController.addClassification));
// Route to build add-classification rules
router.post("/add_classification", classValidate.classificationRules(), classValidate.checkClassData , utilities.handleErrors(invController.addNewClassification));

// Route to build add-vehicle
router.get("/add-vehicle", utilities.handleErrors(invController.addInventory));

// Route to build add-vehicle
router.post("/add-vehicle", vehicleValidate.vehicleRules(), vehicleValidate.checkVehicleData, utilities.handleErrors(invController.addNewVehicle));

// Route to JSON (injet table to innerHTML)
router.get("/getInventory/:classification_id", utilities.checkLogin, utilities.handleErrors(invController.getInventoryJSON))

// Route to edit items information
router.get("/edit/:inv_id", utilities.handleErrors(invController.editingItemsInformation))

//Route post update inventory
router.post("/update/", vehicleValidate.vehicleRules(), vehicleValidate.chechUpdateData , utilities.handleErrors(invController.updateInventory))

module.exports = router;
