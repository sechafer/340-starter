// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Ruta para construir el inventario por vista de clasificación
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build details of car view
router.get("/detail/:classificationId", utilities.handleErrors(invController.buildDetailsId));
// Route to build error 500
router.get("/error/:classificationId", utilities.handleErrors(invController.buildError));

module.exports = router;