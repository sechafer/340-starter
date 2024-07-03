const pool = require("../database/")

/* ***************************
 *  aqui obtiene todoa la clasificacion de datos
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  aqui obtinene todas los datos por: classification_name by classification_id
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

      module.exports = {getClassifications, getInventoryByClassificationId, getDetailsOfCar, error500};