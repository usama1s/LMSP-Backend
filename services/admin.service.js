const sql = require('../services/sql.service')
const pool = require('../db.conn');


module.exports = {

    //GET ALL USERS
    async getAllUsers() {
        try {
            const [results] = await pool.query(sql.GET_ALL_USERS);

            if (results.length === 1) {
                return results[0];
            } else {
                return results;
            }
        } catch (error) {
            throw error;
        }
    },

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
    },

    // ADD COURSE
    async addCourseFullDetails(courseDetails, lecture_file) {
        try {
            const course_name = courseDetails.course_name;
            const course_description = courseDetails.course_description;
            const module_name = courseDetails.module_name;
            const topic_name = courseDetails.topic_name;
            const lectureFile = lecture_file; // Renamed to avoid naming conflict

            const [addCourse] = await pool.query(sql.ADD_COURSE, [course_name, course_description]);
            const courseId = addCourse.insertId;

            const [addModule] = await pool.query(sql.ADD_MODULE, [courseId, module_name]); // Assuming you have a separate query for adding a module
            const moduleId = addModule.insertId;
            await pool.query(sql.ADD_TOPIC, [moduleId, topic_name, lectureFile]);

            return { message: 'Course, module, topics, added' };

        } catch (error) {
            throw error;
        }
    },

    // ADD PROGRAM 
    async addProgram(programDetails) {
        try {
            const programName = programDetails.program_name
            await pool.query(sql.ADD_PROGRAM, programName);
            return { message: 'Program added' };

        } catch (error) {
            throw error;
        }
    },

    // ADD PROGRAM PLAN
    async addProgramPlan(programDetails) {
        try {
            const programId = programDetails.program_id
            const courseId = programDetails.course_id
            const instructorId = programDetails.instructor_id
            const programName = programDetails.program_name
            const startDate = programDetails.start_date
            const endDate = programDetails.end_date
            await pool.query(sql.ADD_PROGRAM_PLAN, [courseId, programId, instructorId, programName, startDate, endDate]);
            return { message: 'Program plan added' };

        } catch (error) {
            throw error;
        }
    },

}

