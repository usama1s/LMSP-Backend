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

    //GET ALL STUDENTS WITH PROGRAM THEY ARE ENROLLED IN
    async getAllStudentsWithPrograms() {
        try {
            const [students] = await pool.query(sql.GET_STUDENT_WITH_PROGRAMS_DETAILS);
            return students;
        } catch (error) {
            console.log(error)
        }
    },

    //GET ALL STUDENTS WITH PROGRAM THEY ARE ENROLLED IN
    async changePassword(current_password, new_password, user_id) {
        try {
            await pool.query(sql.CHANGE_PASSWORD, [new_password, user_id]);
            return {message:"password changes"};
        } catch (error) {
            console.log(error)
        }
    },
}
