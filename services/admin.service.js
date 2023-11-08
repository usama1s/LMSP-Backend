const sql = require('../services/sql.service')
const pool = require('../db.conn');


module.exports = {

    // ADD ITEM IN INVENTORY TABLE
    async addItem({ admin_id, title, description, expiry, induction, make, model, failure_reason, informationFilePath, videoFilePath, imageFilePaths }) {
        try {
            const [result] = await pool.query(sql.ADD_INVENTORY_ITEM, [admin_id, title, description, expiry, induction, make, model, informationFilePath, videoFilePath, failure_reason]);
            const inventoryId = result.insertId;
            await pool.query(sql.ADD_IMAGES_OF_ITEM, [inventoryId, ...imageFilePaths]);
            return { message: 'Inventory item and files uploaded successfully' };
        } catch (error) {
            throw error; // You can choose to throw the error for handling at a higher level
        }
    },

    //GET ALL ADDED ITEMS
    async getAllItems() {
        try {
            const [results] = await pool.query(sql.GET_ALL_ITEMS);

            if (results.length === 1) {
                return results[0];
            } else {
                return results;
            }
        } catch (error) {
            throw error;
        }
    },

    //GET ITEM ID
    async getItemById(inventoryId) {
        try {
            const [results] = await pool.query(sql.GET_ITEM_BY_ID, inventoryId);
            return results[0];
        } catch (error) {
            throw error;
        }
    }


}