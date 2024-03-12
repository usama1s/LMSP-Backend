const sql = require("../services/sql.service");
const pool = require("../db.conn");
const convertBase64 = require("../util/convert.base64.js");

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

  //get User by ID
  async getUserById(userId) {
    try {
      const [user] = await pool.query(sql.GET_USER_BY_ID, [userId]);

      if (user.length === 1) {
        return user[0];
      } else {
        return null; // User not found
      }
    } catch (error) {
      throw error;
    }
  },

  //edit User
  async editUserById(userId, updatedUserData) {
    try {
      await pool.query(sql.EDIT_USER_BY_ID, [updatedUserData, userId]);
      return "User updated successfully";
    } catch (error) {
      throw error;
    }
  },

  //delete user
  async deleteUserById(userId) {
    try {
      await pool.query(sql.DELETE_USER_BY_ID, [userId]);
      return "User deleted successfully";
    } catch (error) {
      throw error;
    }
  },

  // ADD ITEM IN INVENTORY TABLE
  async addItem(inventoryItemDetail) {
    try {
      const {
        admin_id,
        title,
        description,
        expiry,
        induction,
        make,
        model,
        failure_reason,
        attachments,
      } = inventoryItemDetail;
      var videoFilePath = "";
      if (attachments.video_file) {
        videoFilePath = await convertBase64.base64ToMp4(attachments.video_file);
      }
      var infoFilePath = "";
      if (attachments.info_file) {
        infoFilePath = await convertBase64.base64ToPdf(attachments.info_file);
      }

      const images = attachments.images;
      const [result] = await pool.query(sql.ADD_INVENTORY_ITEM, [
        admin_id,
        title,
        description,
        expiry,
        induction,
        make,
        model,
        infoFilePath,
        videoFilePath,
        failure_reason,
      ]);
      const inventoryId = result.insertId;
      const imageFilePaths = [];

      // for (let i = 1; i <= 10; i++) {
      //   const key = `image_${i}`;
      //   const imageBase64 = images[key] || null;
      //   if (imageBase64) {
      //     const imageFilePath = await convertBase64.base64ToJpg(imageBase64);
      //     imageFilePaths.push(imageFilePath);
      //   } else {
      //     imageFilePaths.push(null);
      //   }
      // }

      for (const image of images) {
        const imageFilePath = await convertBase64.base64ToJpg(image);
        imageFilePaths.push(imageFilePath);
      }
      const placeholders = Array.from(
        { length: imageFilePaths.length },
        (_, index) => `?`
      ).join(", ");

      // Build the SQL query with the dynamic number of placeholders
      const sqlQuery = `
        INSERT INTO inventory_image 
        (inventory_id, ${Array.from(
          { length: imageFilePaths.length },
          (_, index) => `image_${index + 1}`
        ).join(", ")})
        VALUES (?, ${placeholders})
      `;

      // Execute the query with the inventoryId and imageFilePaths array
      await pool.query(sqlQuery, [inventoryId, ...imageFilePaths]);

      return { message: "Inventory item and files uploaded successfully" };
    } catch (error) {
      throw error;
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

  //edit item

  async editItemById(inventoryId, updatedItemData) {
    try {
      await pool.query(sql.EDIT_ITEM_BY_ID, [updatedItemData, inventoryId]);
      return "Item updated successfully";
    } catch (error) {
      throw error;
    }
  },

  //delete item
  async deleteItemById(inventoryId) {
    try {
      await pool.query(sql.DELETE_ITEM_BY_ID, [inventoryId]);
      return "Item deleted successfully";
    } catch (error) {
      throw error;
    }
  },

  // ADD COURSE
  async addCourseFullDetails(course_name, course_description, modules) {
    try {
      const [addCourse] = await pool.query(sql.ADD_COURSE, [
        course_name,
        course_description,
      ]);
      const courseId = addCourse.insertId;

      for (module of modules) {
        const module_name = module.module_name;
        const instructor_ids = module.instructor_ids;
        const [addModule] = await pool.query(sql.ADD_MODULE, [
          courseId,
          module_name,
          JSON.stringify(instructor_ids),
        ]);
        const moduleId = addModule.insertId;
        for (topic of module.topics) {
          const lectureFilePath = await convertBase64.base64ToPdf(
            topic.lecture_file
          );
          await pool.query(sql.ADD_TOPIC, [
            moduleId,
            topic.topic_name,
            lectureFilePath,
          ]);
        }
      }
      return { message: "Course, modules, topics added" };
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

      const [addProgram] = await pool.query(sql.ADD_PROGRAM, [
        programName,
        startDate,
        endDate,
      ]);
      const programId = addProgram.insertId;

      const courses = programDetails.courses;

      for (let i = 0; i < courses.length; ++i) {
        const course_id = courses[i].course_id;
        const instructor_id = courses[i].instructor_id;

        await pool.query(sql.ADD_PROGRAM_PLAN, [
          course_id,
          programId,
          instructor_id, // have to make this multiple
        ]);
      }
      return { message: "Program plan added" };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // GET ALL PROGRAM PLAN
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
      const { subject_id, class_date, class_time, class_link } = classDetails;
      await pool.query(sql.ADD_CLASS, [
        subject_id,
        class_date,
        class_time,
        class_link,
      ]);
      return { message: "Class added" };
    } catch (error) {
      throw error;
    }
  },

  //get classes
  async getAllClasses() {
    try {
      const [classes] = await pool.query(sql.GET_ALL_CLASSES);
      return classes;
    } catch (error) {
      throw error;
    }
  },

  // get class by id
  async getClassById(classId) {
    try {
      const [classDetails] = await pool.query(sql.GET_CLASS_BY_ID, [classId]);

      if (classDetails.length === 1) {
        return classDetails[0];
      } else {
        return null; // Class not found
      }
    } catch (error) {
      throw error;
    }
  },

  //edit class by id
  async editClassById(classId, updatedClassDetails) {
    try {
      await pool.query(sql.EDIT_CLASS_BY_ID, [updatedClassDetails, classId]);
      return "Class updated successfully";
    } catch (error) {
      throw error;
    }
  },

  async deleteClassById(classId) {
    try {
      await pool.query(sql.DELETE_CLASS_BY_ID, [classId]);
      return "Class deleted successfully";
    } catch (error) {
      throw error;
    }
  },

  async getAllCourses() {
    try {
      const [courses] = await pool.query(sql.GET_ALL_COURSES);

      const coursesMap = new Map();

      for (const course of courses) {
        const courseId = course.course_id;
        const existingCourse = coursesMap.get(courseId);

        if (!existingCourse) {
          const newCourse = {
            course_id: courseId,
            course_name: course.course_name,
            course_description: course.course_description,
            modules: [
              {
                module_name: course.module_name,
                topics: [
                  {
                    topic_name: course.topic_name,
                    lecture_file_type: "application/pdf",
                    lecture_file: course.lecture_file,
                  },
                ],
                instructor_ids: JSON.parse(course?.instructor_id),
              },
            ],
          };
          coursesMap.set(courseId, newCourse);
        } else {
          const existingModule = existingCourse.modules.find(
            (module) => module.module_name === course.module_name
          );

          if (!existingModule) {
            existingCourse.modules.push({
              module_name: course.module_name,
              topics: [
                {
                  topic_name: course.topic_name,
                  lecture_file_type: "application/pdf",
                  lecture_file: course.lecture_file,
                },
              ],
              instructor_ids: JSON.parse(course?.instructor_id),
            });
          } else {
            existingModule.topics.push({
              topic_name: course.topic_name,
              lecture_file_type: "application/pdf",
              lecture_file: course.lecture_file,
            });
          }
        }
      }

      // Convert the Map values to an array to get the final result
      const resultObject = Array.from(coursesMap.values());

      return resultObject;
    } catch (error) {
      throw error;
    }
  },

  // GET ALL COURSES
  async getAllInstructor() {
    try {
      const [instructors] = await pool.query(sql.GET_ALL_INSTRUCTORS);
      return instructors;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // ENROLLMENT DETAILS
  async enrollStudent(enrollmentDetails) {
    console.log({ enrollmentDetails });
    try {
      let i;
      const course_id = enrollmentDetails.course_id;
      const student_id = enrollmentDetails.student_id;
      const enrollment_date = enrollmentDetails.enrollment_date;
      const enrollment_status = enrollmentDetails.enrollment_status;

      const [existingEnrollment] = await pool.query(
        sql.CHECK_EXISTING_ENROLLMENT,
        [student_id]
      );

      if (existingEnrollment.length > 0) {
        return {
          message: "Student is already enrolled in a program",
        };
      }

      await pool.query(sql.ENROLL_STUDENT, [
        course_id,
        student_id,
        enrollment_date,
        enrollment_status,
      ]);

      return { message: "Student enrolled" };
    } catch (error) {
      return { error };
    }
  },

  // ENROLLMENT DETAILS OF SPECIFIC STUDENT

  async getStudentEnrollmentDetails(student_id) {
    try {
      const [enrollmentDetails] = await pool.query(
        sql.GET_STUDENT_ENROLLMENT_DETAILS,
        [student_id]
      );
      return { enrollmentDetails };
    } catch (error) {
      return { error };
    }
  },
  // GET all enrolled students

  async getAllStudentsWithEnrollment() {
    try {
      const [students] = await pool.query(sql.GET_ALL_ENROLLED_STUDENTS);
      return { students };
    } catch (error) {
      return { error };
    }
  },

  // UPDATE STATUS OF ENROLLMENT

  async updateStudentStatus(status, student_enrollment_id) {
    try {
      await pool.query(sql.UPDATE_STUDENT_STATUS, [
        status,
        student_enrollment_id,
      ]);
      return { message: "Student status updated" };
    } catch (error) {
      return { error };
    }
  },

  //DELETE ENROLLMENT

  async deleteEnrollmentById(enrollmentId) {
    try {
      await pool.query(sql.DELETE_ENROLLMENT_BY_ID, [enrollmentId]);
      return { message: "Student enrollment deleted successfully" };
    } catch (error) {
      throw error;
    }
  },

  // GET ALL ADMINS
  async getAllAdmins() {
    try {
      const [admins] = await pool.query(sql.GET_ALL_ADMINS);
      return admins;
    } catch (error) {
      console.log(error);
    }
  },

  //GET WHOLE PROGRAM DETAILS
  async getWholeProgram() {
    try {
      const [results] = await pool.query(sql.GET_WHOLE_PROGRAM);
      const transformedResults = {};
      for (const result of results) {
        const {
          program_name,
          start_date,
          end_date,
          first_name,
          last_name,
          course_name,
          class_date,
          class_time,
        } = result;
        if (!transformedResults[program_name]) {
          transformedResults[program_name] = {
            program_name,
            start_date,
            end_date,
            courses: [],
          };
        }
        const course = transformedResults[program_name].courses.find(
          (course) => course.course_name === course_name
        );
        if (!course) {
          transformedResults[program_name].courses.push({
            first_name,
            last_name,
            course_name,
            classes: [
              {
                class_date,
                class_time,
              },
            ],
          });
        } else {
          course.classes.push({
            class_date,
            class_time,
          });
          // Sort the classes array by class_date
          course.classes.sort(
            (a, b) => new Date(a.class_date) - new Date(b.class_date)
          );
        }
      }

      const finalResults = Object.values(transformedResults);

      return finalResults;
    } catch (error) {
      throw error;
    }
  },

  async addPaper(subject_id, admin_id, paper_date, paper_time, title) {
    try {
      const [addPaper] = await pool.query(sql.ADD_INCHARGE_PAPER, [
        subject_id,
        admin_id,
        paper_date,
        paper_time,
        title,
      ]);
      return addPaper.insertId;
    } catch (error) {
      console.log(error);
    }
  },

  // GET PAPER BY ID
  async getPaperByPaperId(paperId) {
    try {
      const [paper] = await pool.query(sql.GET_INCHARGE_PAPER_BY_PAPER_ID, [
        paperId,
      ]);
      return paper;
    } catch (error) {
      console.log(error);
    }
  },

  async addPaperQuestion(paperId, questionId) {
    await pool.query(sql.ADD_INCHARGE_PAPER_QUESTION, [paperId, questionId]);
  },

  //Delete paper questions
  async deletePaperQuestions(paper_id) {
    try {
      await pool.query(sql.DELETE_INCHARGE_PAPER_QUESTIONS, [paper_id]);
    } catch (error) {
      throw new Error("Error deleting paper questions");
    }
  },
  // Delete Instructor Paper
  async deleteAdminPaper(paperId) {
    try {
      await pool.query(sql.DELETE_INCHARGE_PAPER, [paperId]);
    } catch (error) {
      console.error(error);
      throw new Error("Error deleting instructor paper");
    }
  },

  async getAllStats(studentId) {
    try {
      const [avgAssignmentMarks] = await pool.query(
        sql.GET_AVG_ASSIGNMENT_MARKS,
        [studentId]
      );
      const [avgQuizMarks] = await pool.query(sql.GET_AVG_QUIZ_MARKS, [
        studentId,
      ]);
      const [avgAttendance] = await pool.query(sql.GET_AVG_ATTENDANCE, [
        studentId,
        1,
      ]);

      // Creating an object with the obtained average values
      const stats = {
        avgAssignmentMarks: avgAssignmentMarks[0].average_assignment_marks,
        avgQuizMarks: avgQuizMarks[0].average_quiz_marks,
        avgAttendance: avgAttendance[0].average_attendance,
      };

      return stats;
    } catch (error) {
      throw new Error("Error getting student statistics");
    }
  },

  async getAllStatsBySubjects(studentId, subjectId) {
    try {
      const [avgAssignmentMarks] = await pool.query(
        sql.GET_AVG_ASSIGNMENT_MARKS_PER_SUBJECT,
        [studentId, subjectId]
      );
      const [avgQuizMarks] = await pool.query(
        sql.GET_AVG_QUIZ_MARKS_PER_SUBJECT,
        [studentId, subjectId]
      );
      const [avgAttendance] = await pool.query(
        sql.GET_AVG_ATTENDANCE_PER_SUBJECT,
        [studentId, 1, subjectId]
      );

      // Creating an object with the obtained average values
      const statsPerSubject = {
        avgSubjectAssignmentMarks:
          avgAssignmentMarks[0].average_subject_assignment_marks,
        avgSubjectQuizMarks: avgQuizMarks[0].average_subject_quiz_marks,
        avgSubjectAttendance: avgAttendance[0].average_subject_attendance,
      };

      return statsPerSubject;
    } catch (error) {
      throw new Error("Error getting student statistics");
    }
  },

  async getAllStudentStatsByCourse(courseId) {
    try {
      const [studentCountPerCourse] = await pool.query(
        sql.GET_STUDENT_COUNT_PER_COURSE,
        [courseId]
      );
      return studentCountPerCourse;
    } catch (error) {
      throw new Error("Error getting student statistics");
    }
  },
  async getQuestionType() {
    try {
      const [questionType] = await pool.query(sql.GET_QUESTION_TYPE);
      return questionType;
    } catch (error) {
      throw new Error("Error getting question type");
    }
  },

  async getQuestionType() {
    try {
      const [questionType] = await pool.query(sql.GET_QUESTION_TYPE);
      return questionType;
    } catch (error) {
      throw new Error("Error getting question type");
    }
  },

  async getAllCoursesWhoseFeedbackIsNotCreated() {
    try {
      const [coursesFeedBackNotCreated] = await pool.query(
        sql.GET_ALL_COURSES_WHOSE_FEEDBACK_IS_NOT_CREATED
      );
      return coursesFeedBackNotCreated;
    } catch (error) {
      throw new Error("Error getting courses feedback not created");
    }
  },

  async getAllCoursesWhoseFeedbackIsCreated() {
    try {
      const [coursesFeedBackCreated] = await pool.query(
        sql.GET_ALL_COURSES_WHOSE_FEEDBACK_IS_CREATED
      );
      return coursesFeedBackCreated;
    } catch (error) {
      throw new Error("Error getting courses feedback created");
    }
  },

  async addCourseFeedback(course_id) {
    try {
      const [courseFeedback] = await pool.query(sql.ADD_COURSE_FEEDBACK, [
        course_id,
      ]);
      return courseFeedback.insertId;
    } catch (error) {
      throw new Error("Error Course FeedBack is not added");
    }
  },

  async addCourseFeedbackQuestions(
    question,
    question_type_id,
    course_feedback_id
  ) {
    try {
      await pool.query(sql.ADD_COURSE_FEEDBACK_QUESTIONS, [
        question,
        question_type_id,
        course_feedback_id,
      ]);
    } catch (error) {
      throw new Error("Error Course FeedBack Question is not added");
    }
  },

  async getCourseFeedbackToUpdate(course_feedback_id) {
    try {
      const [courseFeedBack] = await pool.query(
        sql.GET_COURSE_FEEDBACK_TO_UPDATE,
        [course_feedback_id]
      );
      return courseFeedBack;
    } catch (error) {
      throw new Error("Error getting course feedback to update");
    }
  },

  async updateCourseFeedbackQuestion(
    question,
    question_type_id,
    course_feedback_question_id
  ) {
    try {
      await pool.query(sql.UPDATE_COURSE_FEEDBACK_QUESTION, [
        question,
        question_type_id,
        course_feedback_question_id,
      ]);
    } catch (error) {
      return { error };
    }
  },
};
