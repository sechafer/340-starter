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
  const login =  utilities.Login(res.locals.accountData)
	const className = data[0].classification_name
  	res.render("./inventory/classification", {
		title: className + " vehicles",
		nav,
    login,
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
  const login =  utilities.Login(res.locals.accountData)
	const className = data.inv_year + ' ' + data.inv_make + ' ' + data.inv_model
	res.render("./inventory/classification", {
		title: className,
		nav,
    login,
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
  const login =  utilities.Login(res.locals.accountData)
	const classificationList = await utilities.buildClassificationList()
	res.render("./inventory/management", {
		title: "Veicle Management",
		nav,
    login,
		errors: null,
		classificationSelect: classificationList,
	})
}

/* **********************************
* Build Classification view
************************************ */

invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const login =  utilities.Login(res.locals.accountData)
	res.render("./inventory/add-classification", {
		title: "Add New Classification",
		nav,
    login,
		errors: null
	})
}

/* ****************************************
*  Process New classification
* *************************************** */
invCont.addNewClassification = async function (req, res) {
	let nav = await utilities.getNav()
  const login =  utilities.Login(res.locals.accountData)
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
    login,
		errors: null
		})
	} else {
		req.flash("notice", "Sorry, new classification failed.")
		res.status(501).render("./inventory/add-classification", {
		title: "Add New Classification",
		nav,
    login,
		errors: null,
		})
	}
}

/* **********************************
* Build inventory view
************************************ */
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const login =  utilities.Login(res.locals.accountData)
	const classificationList = await utilities.buildClassificationList()
	res.render("./inventory/add-inventory", {
		title: "Add New Vehicle",
		nav,
    login,
		classificationList,
		errors: null
	})
}

/* ****************************************
*  Add new vehicle
* *************************************** */
invCont.addNewVehicle = async function (req, res) {
	let nav = await utilities.getNav()
  const login =  utilities.Login(res.locals.accountData)
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
    login,
		errors: null,
    classificationSelect: classificationList,
		})
	} else {
		req.flash("notice", "Sorry, new vehicle wasn\'t added.")
		res.status(501).render("./inventory/add-inventory", {
		title: "Add New Vehicle",
		nav,
    classificationSelect: classificationList,
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
  const login =  utilities.Login(res.locals.accountData)
	const invItem = await invModel.getDetailsOfCar(invId)
	const classificationList = await utilities.buildClassificationList(invItem.classification_id)
	const titleName = `${invItem.inv_make} ${invItem.inv_model}`
	res.render("./inventory/edit-inventory", {
		title: "Edit " + titleName,
		nav,
    login,
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
  const login =  utilities.Login(res.locals.accountData)
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
    login,
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

/* **********************************
* Build delete view
************************************ */
invCont.deleteItemsInformation = async function (req, res, next) {
	const invId = parseInt(req.params.inv_id)
	let nav = await utilities.getNav()
  const login =  utilities.Login(res.locals.accountData)
	const invItem = await invModel.getDetailsOfCar(invId)
	const titleName = `${invItem.inv_make} ${invItem.inv_model}`
	res.render("./inventory/delete-confirmation", {
		title: "Delete " + titleName,
		nav,
    login,
		errors: null,
		inv_id: invItem.inv_id,
		inv_make: invItem.inv_make,
		inv_model: invItem.inv_model,
		inv_year: invItem.inv_year,
		inv_price: invItem.inv_price,
		// classification_id: invItem.classification_id,
	})
}

/* ****************************************
*  Delete inventory vehicle
* *************************************** */
invCont.deleteInventory = async function (req, res) {
	const {inv_make, inv_model, inv_id } = req.body
	const invId = parseInt(inv_id)

	//let nav = await utilities.getNav()	
	const deleteResult = await invModel.deleteVehicle(invId)

	const itemNAme = inv_make + " " + inv_model
	if (deleteResult) {
		req.flash(
			"notice",
			`The ${itemNAme} was successfully deleted.`
		)
		res.redirect("/inv/")
	} else {
		req.flash("notice", "Sorry, the deletion failed.")
		res.redirect("./inv/delete/inv_id")
	}
}
module.exports = invCont