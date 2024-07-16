const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
  *  Vehicle Validation Rules
  * ********************************* */
validate.vehicleRules = () => {
    // classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
    return [
    body("classification_id")
        .notEmpty()
        .withMessage("A valid Classification is required"),

    body("inv_make")
        .trim()
        .notEmpty()
        .isLength({ min: 3 })
        .matches(pattern= "^[A-Z][a-z]{2,15}$")
        .withMessage("A make is required."),

    body("inv_model")
        .trim()
        .notEmpty()
        .isLength({ min: 3 })
        .matches(pattern= "^[A-Z][a-z]{2,15}$")
        .withMessage("A model is required."),
    body("inv_description")
        .notEmpty()
        .matches(pattern= "^[A-Z][a-z](?=.*[a-zA-Z0-9]){2,500}")
        .withMessage("A description is required."),
    body("inv_price")
        .notEmpty()
        .matches(pattern= "^[^,a-zA-Z]+[0-9\.0-9]{1,7}$")
        .withMessage("A price is required."),
    body("inv_year")
        .notEmpty()
        .isLength({min:4, max:4})
        .isNumeric()
        .matches(pattern= "^[0-9]{4}$")
        .withMessage("A year is required."),
    body("inv_miles")
        .notEmpty()
        .isLength({min:1, max:6})
        .isNumeric()
        .matches(pattern= "[0-9]{1,6}$")
        .withMessage("The miles in the car is required."),
    body("inv_color")
        .notEmpty()
        .isLength({min:1})
        .matches(pattern= "^[A-Z][a-z]{1,}$")
        .withMessage("The color of the car is required."),
    ]
}

/* ******************************
 * Check data and return errors or continue to add-vehicle
 * ***************************** */
validate.checkVehicleData = async (req, res, next) => {
    let nav = await utilities.getNav()
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    let errors = []
    const classificationList = await utilities.buildClassificationList(classification_id)
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-inventory", {
        errors,
        title: "Add New Vehicle",
        nav,
        classificationList,
        inv_make, 
        inv_model, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_year, 
        inv_miles, 
        inv_color,
        })
        return
    }
    next()
}

/* ******************************
 * Check data and return errors or continue to edit view
 * ***************************** */
validate.chechUpdateData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id } = req.body
    let errors = []
    const classificationList = await utilities.buildClassificationList(classification_id)
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/edit-inventory", {
        errors,
        title: "Edit " + inv_make + " " + inv_model,
        nav,
        classificationList,
        inv_make, 
        inv_model, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_year, 
        inv_miles, 
        inv_color,
        inv_id,
        })
        return
    }
    next()
}

module.exports = validate;