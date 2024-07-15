const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
	const classification_id = req.params.classificationId
	const data = await invModel.getInventoryByClassificationId(classification_id)
	const grid = await utilities.buildClassificationGrid(data)
	let nav = await utilities.getNav()
	const className = data[0].classification_name
  	res.render("./inventory/classification", {
		title: className + " vehicles",
		nav,
		grid,
	})
}

/* ***************************
 *  Build details of car view
 * ************************** */
invCont.buildDetailsId = async function (req, res, next) {
  const classification_id = req.params.classificationId
	const data = await invModel.getDetailsOfCar(classification_id)
	const grid = await utilities.buildDetailsId(data)
	let nav = await utilities.getNav()
	const className = data.inv_year + ' ' + data.inv_make + ' ' + data.inv_model
	res.render("./inventory/classification", {
		title: className,
		nav,
		grid,
	})
}

/* ***************************
 *  Build error view
 * ************************** */
invCont.buildError = async function (req, res, next) {
  const data = await invModel.error500() // This variable is where the error 500 will occur
	const message = await utilities.buildErrorMessage(data)
	let nav = await utilities.getNav()
	res.render("./errors/error", {
		title: data,
		nav,
		message,
	})
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
	const classificationSelect = await utilities.buildClassificationList()
	res.render("./inventory/management", {
		title: "Veicle Management",
		nav,
		errors: null,
		classificationSelect,
	})
}

/* **********************************
* Build Classification view
************************************ */

invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
	res.render("./inventory/add-classification", {
		title: "Add New Classification",
		nav,
		errors: null
	})
}

/* ****************************************
*  Process New classification
* *************************************** */
invCont.addNewClassification = async function (req, res) {
	let nav = await utilities.getNav()
	const { classification_name } = req.body

	const classResult = await invModel.addClassification(
		classification_name
  )

	if (classResult) {
		req.flash(
		"notice",
		` The ${classification_name} classification was successfully added.`
		)
		res.status(201).render("./inventory/management", {
		title: "Veicle Management",
		nav,
		errors: null
		})
	} else {
		req.flash("notice", "Sorry, new classification failed.")
		res.status(501).render("./inventory/add-classification", {
		title: "Add New Classification",
		nav,
		errors: null,
		})
	}
}

/* **********************************
* Build inventory view
************************************ */
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
	const classificationList = await utilities.buildClassificationList()
	res.render("./inventory/add-inventory", {
		title: "Add New Vehicle",
		nav,
		classificationList,
		errors: null
	})
}

/* ****************************************
*  Add new vehicle
* *************************************** */
invCont.addNewVehicle = async function (req, res) {
	let nav = await utilities.getNav()
	const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  const classificationList = await utilities.buildClassificationList()

	const classResult = await invModel.addVehicle(
		classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
  )

	if (classResult) {
		req.flash(
		"notice",
		`The ${inv_make} ${inv_model} was successfully added.`
		)
		res.status(201).render("./inventory/management", {
		title: "Veicle Management",
		nav,
		errors: null
		})
	} else {
		req.flash("notice", "Sorry, new vehicle wasn\'t added.")
		res.status(501).render("./inventory/add-inventory", {
		title: "Add New Vehicle",
		nav,
    classificationList,
		errors: null,
		})
	}
}

/* **********************************
* Return Inventory by Classification As JSON
************************************ */
invCont.getInventoryJSON = async (req, res, next) => {
	const classification_id = parseInt(req.params.classification_id)
	const invData = await invModel.getInventoryByClassificationId(classification_id)
	if (invData[0].inv_id) {
	return res.json(invData)
	} else {
	next(new Error("No data returned"))
	}
}

/* **********************************
* Build edit inventory view
************************************ */
invCont.editingItemsInformation = async function (req, res, next) {
	const invId = parseInt(req.params.inv_id)
	let nav = await utilities.getNav()
	const invItem = await invModel.getDetailsOfCar(invId)
	const classificationList = await utilities.buildClassificationList(invItem.classification_id)
	const titleName = `${invItem.inv_make} ${invItem.inv_model}`
	res.render("./inventory/edit-inventory", {
		title: "Edit " + titleName,
		nav,
		classificationList,
		errors: null,
		inv_id: invItem.inv_id,
		inv_make: invItem.inv_make,
		inv_model: invItem.inv_model,
		inv_year: invItem.inv_year,
		inv_description: invItem.inv_description,
		inv_image: invItem.inv_image,
		inv_thumbnail: invItem.inv_thumbnail,
		inv_price: invItem.inv_price,
		inv_miles: invItem.inv_miles,
		inv_color: invItem.inv_color,
		classification_id: invItem.classification_id,
	})
}

/* ****************************************
*  Update inventory vehicle
* *************************************** */
invCont.updateInventory = async function (req, res) {
	let nav = await utilities.getNav()
	const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id } = req.body

	const updateResult = await invModel.UpdateVehicle(
		classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id)
	const itemNAme = inv_make + " " + inv_model
	if (updateResult) {
		req.flash(
			"notice",
			`The ${itemNAme} was successfully updated.`
		)
		res.redirect("/inv/")
	} else {
		const classificationList = await utilities.buildClassificationList(classification_id)
		req.flash("notice", "Sorry, the insert failed.")
		res.status(501).render("./inventory/edit-inventory", {
		title: "Edit " + itemNAme,
		nav,
		errors: null,
		classificationList: classificationList,
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
		classification_id,
		})
	}
}

module.exports = invCont