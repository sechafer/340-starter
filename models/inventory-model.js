const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(everything = false){
  if (everything) {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
  } else {
    return await pool.query(
      `SELECT c.classification_id, c.classification_name
      FROM public.classification AS c
      JOIN public.inventory AS i
      ON c.classification_id = i.classification_id
      WHERE c.classification_approved = true
      AND i.inv_approved = true
      GROUP BY c.classification_id
      ORDER BY c.classification_name`
    );
  }
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
      WHERE i.classification_id = $1
      AND i.inv_approved = true`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}

/* ***************************
 *  Get all information of car by inv_id
 * ************************** */
async function getDetailsOfCar(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      WHERE i.inv_id = $1`,
      [inv_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}

async function error500() {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      WHERE i.type = 8`
    );
    return data.rows[0];
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
    return "Server Error";
  }
}

/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const data = await pool.query(
      `INSERT INTO public.classification (classification_name) VALUES ($1)`,
      [classification_name]
    );
    return "Adding classification was successful";
  } catch (error) {
    console.error("Adding classification error " + error);
  }
}

/* ***************************
 *  Check if classification exist in database
 * ************************** */
async function checkExistingClassification(classification_name){
  try {
    const sql = "SELECT * FROM public.classification WHERE classification_name = $1";
    const classification = await pool.query(sql, [classification_name]);
    return classification.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* ***************************
 *  Insert new vehicle into inventory
 * ************************** */
async function addVehicle(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) {
  try {
    const data = await pool.query(
      `INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color]
    );
    return "Adding vehicle was successful";
  } catch (error) {
    console.error("Adding vehicle error " + error);
  }
}

/* ***************************
 *  Update inventory Data
 * ************************** */
async function UpdateVehicle(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id) {
  try {
    const sql =
      "UPDATE public.inventory SET classification_id = $1, inv_make = $2, inv_model = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_year = $8, inv_miles = $9, inv_color = $10 WHERE inv_id = $11 RETURNING *";

    const data = await pool.query(sql, [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id]);
    return data.rows[0];
  } catch (error) {
    console.error("Update vehicle error: " + error);
  }
}

/* ***************************
 *  Update inventory Data
 * ************************** */
async function deleteVehicle(inv_id) {
  try {
    const sql = 'DELETE FROM public.inventory WHERE inv_id = $1';
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    throw new Error("Delete Inventory error");
  }
}

async function pendingInv(account) {
  try {
    if (account.account_type == "Admin") {
      const data = await pool.query('SELECT * FROM public.inventory WHERE inv_approved = false');
      return data;
    } else {
      throw new Error("Please, login");
    }
  } catch (error) {
    throw new Error("Approved - pending inventory error");
  }
}

async function pendingClass(account) {
  try {
    if (account.account_type == "Admin") {
      const data = await pool.query('SELECT * FROM public.classification WHERE classification_approved = false');
      return data;
    } else {
      throw new Error("Please, login");
    }
  } catch (error) {
    throw new Error("Approved - pending classification error");
  }
}

/* ***************************
 *  Get all information of classification by classification_id
 * ************************** */
async function getDetailsOfClassification(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.classification AS c WHERE c.classification_id = $1`,
      [classification_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}

/* ***************************
 *  Update Classification Database - approved
 * ************************** */
async function approvedClassification(classification_id, account_id) {
  try {
    const sql = `
      UPDATE public.classification
      SET classification_approved = $2,
          account_id = $3,
          classification_approval_date = CURRENT_TIMESTAMP
      WHERE classification_id = $1
      RETURNING *
    `;
    const data = await pool.query(sql, [classification_id, true, account_id]);
    return data;
  } catch (error) {
    throw new Error("Update classification error");
  }
}

/* ***************************
 *  Update Classification Database - reject
 * ************************** */
async function rejecClassification(classification_id) {
  try {
    const sql = `
      DELETE FROM public.classification
      WHERE classification_id = $1
      RETURNING *
    `;
    const data = await pool.query(sql, [classification_id]);
    return data;
  } catch (error) {
    throw new Error("Update classification error");
  }
}

/* ***************************
 *  Get require vehicles to delete from Database - reject
 * ************************** */
async function buildVehiclesToReject(classification_id) {
  try {
    const sql = `
      SELECT inv_make, inv_model
      FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1
    `;
    const data = await pool.query(sql, [classification_id]);
    return data;
  } catch (error) {
    throw new Error("Error getting require vehicles.");
  }
}

/* ***************************
 *  Update Inventory Database - approved
 * ************************** */
async function approvedInventory(classification_id, account_id, inv_id) {
  try {
    const verify = await pool.query(
      "SELECT * FROM public.classification WHERE classification_id = $1 AND classification_approved = $2",
      [classification_id, true]
    );
    if (verify.rowCount > 0) {
      const sql = `
        UPDATE public.inventory
        SET inv_approved = $2,
            account_id = $3,
            inv_approved_date = CURRENT_TIMESTAMP,
            classification_id = $4
        WHERE inv_id = $1
        RETURNING *
      `;
      const data = await pool.query(sql, [inv_id, true, account_id, classification_id]);
      return data;
    }
  } catch (error) {
    throw new Error("Update Inventory error");
  }
}

/* ***************************
 *  Reject inventory item - It will delete item from database
 * ************************** */
async function rejecInventory(inv_id) {
  try {
    const sql = `
      DELETE FROM public.inventory
      WHERE inv_id = $1
      RETURNING *
    `;
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    throw new Error("Reject inventory error");
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getDetailsOfCar,
  error500,
  addClassification,
  checkExistingClassification,
  addVehicle,
  UpdateVehicle,
  deleteVehicle,
  pendingInv,
  pendingClass,
  getDetailsOfClassification,
  approvedClassification,
  rejecClassification,
  buildVehiclesToReject,
  approvedInventory,
  rejecInventory
};