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
	const login =  utilities.Login(res.locals.accountData)
	res.render("./errors/error", {
		title: data,
		nav,
		login,
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
	let approves = await utilities.approved(res.locals)
	res.render("./inventory/management", {
		title: "Veicle Management",
		nav,
		login,
		errors: null,
		classificationSelect: classificationList,
		approves,
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
	const classificationList = await utilities.buildClassificationList()
	const classResult = await invModel.addClassification(
		classification_name
  	)
  	let approves = await utilities.approved(res.locals)
	if (classResult) {
		req.flash(
		"notice",
		`The ${classification_name} classification was successful and is waiting to be approved by the manager `
		)
		res.status(201).render("./inventory/management", {
		title: "Veicle Management",
		nav,
		login,
		errors: null,
		classificationSelect: classificationList,
		approves,
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
	const classificationList = await utilities.buildClassificationList(true)
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
	let approves = await utilities.approved(res.locals)
	const classResult = await invModel.addVehicle(
		classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
	)

	if (classResult) {
		req.flash(
		"notice",
		`The ${inv_make} ${inv_model} was successfully added and is waiting to be approved by the manager`
		)
		res.status(201).render("./inventory/management", {
		title: "Veicle Management",
		nav,
		login,
		errors: null,
		classificationSelect: classificationList,
		approves,
		})
	} else {
		req.flash("notice", "Sorry, new vehicle wasn\'t added.")
		res.status(501).render("./inventory/add-inventory", {
		title: "Add New Vehicle",
		nav,
		login,
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
	const classificationList = await utilities.buildClassificationList(true ,invItem.classification_id)
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
	const classificationList = await utilities.buildClassificationList()
	let approves = await utilities.approved(res.locals)
	const updateResult = await invModel.UpdateVehicle(
		classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id)
	const itemNAme = inv_make + " " + inv_model
	if (updateResult) {
		req.flash(
			"notice",
			`The ${itemNAme} was successfully updated.`
		)
		res.status(201).render("./inventory/management", {
			title: "Veicle Management",
			nav,
			login,
			errors: null,
			classificationSelect: classificationList,
			approves,
		})
	} else {
		const classificationList = await utilities.buildClassificationList(true ,classification_id)
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
	})
}

/* ****************************************
*  Delete inventory vehicle
* *************************************** */
invCont.deleteInventory = async function (req, res) {
	const {inv_make, inv_model, inv_id } = req.body
	const invId = parseInt(inv_id)
	let nav = await utilities.getNav()	
	const login =  utilities.Login(res.locals.accountData)
	const deleteResult = await invModel.deleteVehicle(invId)
	const classificationList = await utilities.buildClassificationList()
	let approves = await utilities.approved(res.locals)
	const itemNAme = inv_make + " " + inv_model

	if (deleteResult) {
		req.flash(
			"notice",
			`The ${itemNAme} was successfully deleted.`
		)
		res.status(201).render("./inventory/management", {
			title: "Veicle Management",
			nav,
			login,
			errors: null,
			classificationSelect: classificationList,
			approves,
		})
	} else {
		req.flash("notice", "Sorry, the deletion failed.")
		res.status(501).render("./inv/delete/inv_id", {
			// title: "Delete " + titleName,
			// nav,
			// login,
			// errors: null,
			// inv_id: invItem.inv_id,
			// inv_make: invItem.inv_make,
			// inv_model: invItem.inv_model,
			// inv_year: invItem.inv_year,
			// inv_price: invItem.inv_price,
			// pending
		})
	}
}

/* **********************************
* Build approval view
************************************ */
invCont.approve = async function (req, res, next) {
	let nav = await utilities.getNav()
	const login =  utilities.Login(res.locals.accountData)
	let approved = await utilities.approvedClassAndInv(res.locals.accountData)
	res.render("./inventory/pending-approves", {
		title: "Pending approvals",
		nav,
		login,
		errors: null,
		pending: approved,
	})
}

/* **********************************
* Build approval classification view
************************************ */
invCont.approveClass = async function (req, res, next) {
	const invId = parseInt(req.params.classification_id)
	let nav = await utilities.getNav()
	const login =  utilities.Login(res.locals.accountData)
	const classItem = await invModel.getDetailsOfClassification(invId)
	const titleName = `${classItem.classification_name}`
	res.render("./inventory/approve-classification", {
		title: "Approve " + titleName + " Classification",
		nav,
		login,
		errors: null,
		classification_id: classItem.classification_id,
		classification_name: classItem.classification_name,
	})
}

/* ****************************************
*  Approved classification 
* *************************************** */
invCont.approvedClassification = async function (req, res) {
	const {classification_id, classification_name } = req.body
	const classId = parseInt(classification_id)
	const accountId = res.locals.accountData.account_id
	let nav = await utilities.getNav()
	const login =  utilities.Login(res.locals.accountData)
	const approvedResult = await invModel.approvedClassification(classId, accountId)
	let approved = await utilities.approvedClassAndInv(res.locals.accountData)
	const className = classification_name

	if (approvedResult) {
		req.flash(
			"notice",
			`The ${className} classification was approved.`
		)
		res.status(201).render("./inventory/pending-approves", {
			title: "Pending approvals",
			nav,
			login,
			errors: null,
			pending: approved,
			// pending
		})
	} else {
		req.flash("notice", "Sorry, the aproval failed.")
		res.status(501).render("./inventory/pending-approves", {
			title: "Pending approvals",
			nav,
			login,
			errors: null,
			pending: approved,
			// pending
		})
	}
}

/* **********************************
* Build reject classification view
************************************ */
invCont.rejectClass = async function (req, res, next) {
	const invId = parseInt(req.params.classification_id)
	let nav = await utilities.getNav()
	const login =  utilities.Login(res.locals.accountData)
	const classItem = await invModel.getDetailsOfClassification(invId)
	const titleName = `${classItem.classification_name}`
	res.render("./inventory/reject-classification", {
		title: "Approve " + titleName + " Classification",
		nav,
		login,
		errors: null,
		classification_id: classItem.classification_id,
		classification_name: classItem.classification_name,
	})
}

/* ****************************************
*  Reject classification 
* *************************************** */
invCont.rejectClassification = async function (req, res) {
	const {classification_id, classification_name } = req.body
	const classId = parseInt(classification_id)
	let nav = await utilities.getNav()
	const login =  utilities.Login(res.locals.accountData)
	
	try {
		const approvedResult = await invModel.rejecClassification(classId)
		let approved = await utilities.approvedClassAndInv(res.locals.accountData)
	
		const className = classification_name
		if (approvedResult) {
			req.flash(
				"notice",
				`The ${className} was successfully rejected.` 
			)
			res.status(201).render("./inventory/pending-approves", {
				title: "Pending approvals",
				nav,
				login,
				errors: null,
				pending: approved,
				// pending 
			})
		} 
		else {
			const requared = await invModel.buildVehiclesToReject(classId) // todo continue with this section
			let delVehicles = "The following vehicles need to be rejected before you can reject this Classification:"
			req.flash(
				"notice",
				delVehicles
			)
			requared.rows.forEach(vehicle => {
				let makeAndModel = vehicle.inv_make + " " + vehicle.inv_model
				req.flash(
					"notice",
					makeAndModel
				)
			})
			res.status(501).render("./inventory/pending-approves", {
				title: "Pending approvals",
				nav,
				login,
				errors: null,
				pending: approved,
				// pending
			})
		}
	} catch (error) {
		new Error("Error building required vehicles")
	}
}

/* **********************************
* Build approval Invenotry view
************************************ */
invCont.approveInv = async function (req, res, next) {
	const invId = parseInt(req.params.inv_id)
	let nav = await utilities.getNav()
	const login =  utilities.Login(res.locals.accountData)
	const invItem = await invModel.getDetailsOfCar(invId)
	const titleName = `${invItem.inv_make} ${invItem.inv_model}`
	res.render("./inventory/approve-inventory", {
		title: "Approve " + titleName + " Classification",
		nav,
		login,
		errors: null,
		classification_id: invItem.classification_id,
		inv_id: invItem.inv_id,
		inv_color: invItem.inv_color,
		inv_make: invItem.inv_make,
		inv_miles: invItem.inv_miles,
		inv_model: invItem.inv_model,
		inv_price: invItem.inv_price,
		inv_year: invItem.inv_year,
	})
}

/* ****************************************
*  Approved Inventory 
* *************************************** */
invCont.approvedInventory = async function (req, res) {
	const {classification_id, inv_id, inv_make, inv_model } = req.body
	const classId = parseInt(classification_id)
	const invId = parseInt(inv_id)
	const accountId = res.locals.accountData.account_id
	let nav = await utilities.getNav()
	const login =  utilities.Login(res.locals.accountData)
	const approvedResult = await invModel.approvedInventory(classId, accountId, invId)
	let approved = await utilities.approvedClassAndInv(res.locals.accountData)

	const invName = inv_make + " " + inv_model
	if (approvedResult) {
		req.flash(
			"notice",
			`The ${invName} was successfully approved.`
		)
		res.status(201).render("./inventory/pending-approves", {
			title: "Pending approvals",
			nav,
			login,
			errors: null,
			pending: approved,
			// penidng
		})
	} else {
		req.flash("notice", `Sorry, the ${invName} approval has failed. The classification assciated with this car has not been approved yet`)
		res.status(501).render("./inventory/pending-approves", {
			title: "Pending approvals",
			nav,
			login,
			errors: null,
			pending: approved,
			// pending
		})
	}
}

/* **********************************
* Build reject inventory view
************************************ */
invCont.rejectInv = async function (req, res, next) {
	const invId = parseInt(req.params.inv_id)
	let nav = await utilities.getNav()
	const login =  utilities.Login(res.locals.accountData)
	const invItem = await invModel.getDetailsOfCar(invId)
	const titleName = `${invItem.inv_make} ${invItem.inv_model}`
	res.render("./inventory/reject-inventory", {
		title: "Reject " + titleName + " Vehicle",
		nav,
		login,
		errors: null,
		classification_id: invItem.classification_id,
		inv_id: invItem.inv_id,
		inv_color: invItem.inv_color,
		inv_make: invItem.inv_make,
		inv_miles: invItem.inv_miles,
		inv_model: invItem.inv_model,
		inv_price: invItem.inv_price,
		inv_year: invItem.inv_year,
	})
}

/* ****************************************
*  Reject Inventory 
* *************************************** */
invCont.rejectInventory = async function (req, res) {
	const {inv_id, inv_make, inv_model} = req.body
	const invId = parseInt(inv_id)
	let nav = await utilities.getNav()
	const login =  utilities.Login(res.locals.accountData)
	
	try {
		const approvedResult = await invModel.rejecInventory(invId)
		let approved = await utilities.approvedClassAndInv(res.locals.accountData)
	
		const invName = `${inv_make} ${inv_model}`
		if (approvedResult) {
			req.flash(
				"notice",
				`The ${invName} was successful rejected and has been deleted from database`
			)
			res.status(201).render("./inventory/pending-approves", {
				title: "Pending approvals",
				nav,
				login,
				errors: null,
				pending: approved,
				// pending
			})
		} 
		else {
			req.flash(
				"notice",
				`The rejection faild`
			)
			res.status(501).render("./inventory/pending-approves", {
				title: "Pending approvals",
				nav,
				login,
				errors: null,
				pending: approved,
				// pending
			})
		}
	} catch (error) {
		new Error("Error rejecting inventory")
	}
}

module.exports = invCont