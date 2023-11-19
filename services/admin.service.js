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

    async addCourseFullDetails(courseDetails, module, topic, filePath) {
        try {
            const course_name = courseDetails.course_name;
            const course_description = courseDetails.course_description;

            const [addCourse] = await pool.query(sql.ADD_COURSE, [course_name, course_description]);
            const courseId = addCourse.insertId;
            const module_name = module.module_name;

            const [addModule] = await pool.query(sql.ADD_MODULE, [courseId, module_name]);
            const moduleId = addModule.insertId;
            await pool.query(sql.ADD_TOPIC, [moduleId, topic.topic_name, filePath]);
            return { message: 'Course, modules, topics added' };
        } catch (error) {
            throw error;
        }
    },


    // ADD PROGRAM 
    async addProgram(programDetails) {
        try {
            const programName = programDetails.program_name
            return { message: 'Program added' };

        } catch (error) {
            throw error;
        }
    },

    // ADD PROGRAM PLAN
    async addProgramPlan(programDetails) {
        try {
            const programName = programDetails.program_name;
            const startDate = programDetails.start_date;
            const endDate = programDetails.end_date;

            const [addProgram] = await pool.query(sql.ADD_PROGRAM, [programName, startDate, endDate]);
            const programId = addProgram.insertId;

            const courses = programDetails.courses;

            for (let i = 0; i < courses.length; ++i) {
                const course_id = courses[i].course_id;
                const instructor_id = courses[i].instructor_id;

                await pool.query(sql.ADD_PROGRAM_PLAN, [course_id, programId, instructor_id]);
            }
            return { message: 'Program plan added' };

        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    //GET ITEM ID
    async getAllProgramPlan() {
        try {
            const [results] = await pool.query(sql.GET_PROGRAM_PLAN);
            return results;
        } catch (error) {
            throw error;
        }
    },

    // ADD CLASS
    async addClass(classDetails) {
        try {
            const { program_plan_id, class_date, class_time, class_link } = classDetails;
            await pool.query(sql.ADD_CLASS, [program_plan_id, class_date, class_time, class_link]);
            return { message: 'Class added' };

        } catch (error) {
            throw error;
        }
    },

    //GET ALL COURSES
    async getAllCourses() {
        try {
            const [courses] = await pool.query(sql.GET_ALL_COURSES);
            return courses;
        } catch (error) {
            throw error;
        }
    },

    //GET ALL COURSES
    async getAllInstructor() {
        try {
            const [instructors] = await pool.query(sql.GET_ALL_INSTRUCTORS);
            return instructors;
        } catch (error) {
            console.log(error)
            throw error;
        }
    },

    // ENROLLMENT DETAILS
    async enrollStudent(enrollmentDetails) {
        try {
            let i
            const program_plan_id = enrollmentDetails.program_plan_id;
            const student_id = enrollmentDetails.student_id;
            const enrollment_date = enrollmentDetails.enrollment_date;
            const program_status = enrollmentDetails.program_status;
            for (i = 0; i < program_plan_id.length; ++i) {
                await pool.query(sql.ENROLL_STUDENT, [program_plan_id[i], student_id, enrollment_date, program_status]);
            }
            return { message: 'Student enrolled' };

        } catch (error) {
            return { error };
        }
    },
}

