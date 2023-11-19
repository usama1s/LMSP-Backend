const sql = require('../services/sql.service')
const pool = require('../db.conn');

module.exports = {

    //GET ALL STUDENTS
    async getAllStudents() {
        try {
            const [students] = await pool.query(sql.GET_ALL_STUDENTS);
            return students;
        } catch (error) {
            console.log(error)
        }
    },

}
