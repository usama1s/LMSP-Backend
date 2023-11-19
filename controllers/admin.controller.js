const adminService = require('../services/admin.service');
const mime = require('mime-types');
const fs = require('fs').promises;
const path = require('path');

module.exports = {

    //GET ALL USERS
    async getAllUsers(req, res) {
        try {
            const result = await adminService.getAllUsers();
            return res.status(200).json({ result });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred' });
        }
    },

    // ADD ITEM WITH PICTURES
    async addItem(req, res) {
        try {
            const inventoryItemDetail = req.body;
            const result = await adminService.addItem(inventoryItemDetail);
            return res.status(201).json({ message: result.message });
        } catch (error) {
            console.error('Error handling file uploads:', error);
            return res.status(500).json({ error: 'Failed to upload files and insert data' });
        }
    },

    //GET ALL ADDED ITEMS
    async getAllItems(req, res) {
        try {
            const result = await adminService.getAllItems();
            return res.status(200).json({ result });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred' });
        }
    },

    //GET ITEM ID
    async getItemById(req, res) {
        try {
            const inventoryId = req.params.inventoryId
            const result = await adminService.getItemById(inventoryId);
            return res.status(200).json({ result });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred' });
        }
    },

    // ADD COURSE
    async addCourseFullDetails(req, res) {
        try {
            const courseDetails = req.body;
            const { course_name, course_description, modules } = courseDetails;
            const result = await adminService.addCourseFullDetails(course_name, course_description, modules);
            res.status(200).json(result.message)
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred' });
        }
    },

    // ADD PROGRAM
    async addProgram(req, res) {
        try {
            const programDetails = req.body
            const result = await adminService.addProgram(programDetails);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred' });
        }
    },

    // ADD PROGRAM PLAN
    async addProgramPlan(req, res) {
        try {
            const programPlanDetails = req.body
            const result = await adminService.addProgramPlan(programPlanDetails);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred' });
        }
    },

    // GET PROGRAM PLAN
    async getAllProgramPlan(req, res) {
        try {
            const result = await adminService.getAllProgramPlan();
            return res.status(200).json({ result });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred' });
        }
    },

    // ADD CLASS
    async addClass(req, res) {
        try {
            const classDetails = req.body
            const result = await adminService.addClass(classDetails);
            return res.status(200).json(result.message);
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred' });
        }
    },

    // GET ALL COURSES
    async getAllCourses(req, res) {
        try {
            const result = await adminService.getAllCourses();
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred' });
        }
    },

    // GET ALL INSTRUCTORS
    async getAllInstructor(req, res) {
        try {
            const instructors = await adminService.getAllInstructor();
            return res.status(200).json({ instructors });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred' });
        }
    },

    // ENROLL STUDENT
    async enrollStudent(req, res) {
        try {
            const enrollmentDetails = req.body
            const result = await adminService.enrollStudent(enrollmentDetails);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred' });
        }
    },

    //GET ALL ADMINS
    async getAllAdmins(req, res) {
        try {
            const admins = await adminService.getAllAdmins();
            return res.status(200).json({ admins });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred' });
        }
    },
}