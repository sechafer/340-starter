// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classValidate = require('../utilities/classification-validation')
const vehicleValidate = require('../utilities/vehicle-validation')
<<<<<<< HEAD
=======

// // Route to building management view
router.get("/", utilities.handleErrors(invController.buildManagement));
<<<<<<< HEAD
=======
>>>>>>> main

// // Route to building management view
router.get("/", utilities.handleErrors(invController.buildManagement));
>>>>>>> 7fae5ecec95e880afce0b6e519aeafc25e5b4b14
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

<<<<<<< HEAD
=======
// Route to build add-classification
router.get("/add_classification", utilities.handleErrors(invController.addClassification));
// Route to build add-classification rules
router.post("/add_classification", classValidate.classificationRules(), classValidate.checkClassData , utilities.handleErrors(invController.addNewClassification));

>>>>>>> main
// Route to build add-vehicle
router.get("/add-vehicle", utilities.handleErrors(invController.addInventory));

// Route to build add-vehicle
router.post("/add-vehicle", vehicleValidate.vehicleRules(), vehicleValidate.checkVehicleData, utilities.handleErrors(invController.addNewVehicle));

<<<<<<< HEAD
module.exports = router;
=======
<<<<<<< HEAD
module.exports = router;
=======
module.exports = router;
>>>>>>> main
>>>>>>> 7fae5ecec95e880afce0b6e519aeafc25e5b4b14
