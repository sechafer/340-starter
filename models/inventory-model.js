const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getDetailsOfCar(inv_make) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      WHERE i.inv_id = $1`,
      [inv_make]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}
async function error500() {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      WHERE i.type = 8`
    )
    return data.rows[0]
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
    return "Server Error"
  }
}

<<<<<<< HEAD
async function addClassification(classification_name) {
  try {
    const data = await pool.query(

      `INSERT INTO public.classification (classification_name) VALUES ($1)`,
      [classification_name]
    )
    return "Adding classification was succesful"
  } catch (error) {
    console.error("Addingclassification error " + error)
  }
}

async function checkExistingClassification(classification_name){
  try {
    const sql = "SELECT * FROM public.classification WHERE classification_name = $1"
    const classification = await pool.query(sql, [classification_name])
    return classification.rowCount
  } catch (error) {
    return error.message
  }
}

async function addVehicle(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) {
  try {
    const data = await pool.query(

      `INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color]
    )
    return "Adding classification was succesful"
  } catch (error) {
    console.error("Addingclassification error " + error)
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getDetailsOfCar, error500, addClassification, checkExistingClassification, addVehicle};
=======
<<<<<<< HEAD
async function addClassification(classification_name) {
  try {
    const data = await pool.query(

      `INSERT INTO public.classification (classification_name) VALUES ($1)`,
      [classification_name]
    )
    return "Adding classification was succesful"
  } catch (error) {
    console.error("Addingclassification error " + error)
  }
}

async function checkExistingClassification(classification_name){
  try {
    const sql = "SELECT * FROM public.classification WHERE classification_name = $1"
    const classification = await pool.query(sql, [classification_name])
    return classification.rowCount
  } catch (error) {
    return error.message
  }
}

async function addVehicle(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) {
  try {
    const data = await pool.query(

      `INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color]
    )
    return "Adding classification was succesful"
  } catch (error) {
    console.error("Addingclassification error " + error)
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getDetailsOfCar, error500, addClassification, checkExistingClassification, addVehicle};
=======
      async function addClassification(classification_name) {
        try {
          const data = await pool.query(
      
            `INSERT INTO public.classification (classification_name) VALUES ($1)`,
            [classification_name]
          )
          return "Adding classification was succesful"
        } catch (error) {
          console.error("Addingclassification error " + error)
        }
      }
      
      async function checkExistingClassification(classification_name){
        try {
          const sql = "SELECT * FROM public.classification WHERE classification_name = $1"
          const classification = await pool.query(sql, [classification_name])
          return classification.rowCount
        } catch (error) {
          return error.message
        }
      }
      
      async function addVehicle(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) {
        try {
          const data = await pool.query(
      
            `INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color]
          )
          return "Adding classification was succesful"
        } catch (error) {
          console.error("Addingclassification error " + error)
        }
      }

      module.exports = {getClassifications, getInventoryByClassificationId, getDetailsOfCar, error500, addClassification, checkExistingClassification, addVehicle};
>>>>>>> main
>>>>>>> 7fae5ecec95e880afce0b6e519aeafc25e5b4b14
