CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_picture VARCHAR(150),
    email VARCHAR(100),
    password VARCHAR(255),
    role VARCHAR(10),
    marital_status VARCHAR(15),
    country VARCHAR(30),
    organization VARCHAR(50),
    designation VARCHAR(20),
    qualification VARCHAR(50),
    register_date DATE
);
CREATE TABLE admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    employment_id VARCHAR(10),
    admin_type VARCHAR(10),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE student (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    register_id VARCHAR(15),
    status VARCHAR(15) DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
CREATE TABLE instructor (
    instructor_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    employment_id VARCHAR(10),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT,
    title VARCHAR(50),
    description VARCHAR(5000),
    expiry date,
    induction date,
    make VARCHAR(30),
    model VARCHAR(10),
    information_file VARCHAR(150),
    video_file VARCHAR(150),
    failure_reason VARCHAR(1000),
    FOREIGN KEY (admin_id) REFERENCES admin(admin_id)
);

CREATE TABLE inventory_image (
    inventory_image_id INT AUTO_INCREMENT PRIMARY KEY,
    inventory_id INT,
    image_1 varchar(300),
    image_2 varchar(300),
    image_3 varchar(300),
    image_4 varchar(300),
    image_5 varchar(300),
    image_6 varchar(300),
    image_7 varchar(300),
    image_8 varchar(300),
    image_9 varchar(300),
    image_10 varchar(300),	
    FOREIGN KEY (inventory_id) REFERENCES inventory(inventory_id)
);


CREATE TABLE course (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_name INT,
    course_description VARCHAR(500)
);

CREATE TABLE module (
	module_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT, 
    module_name varchar (50),
    FOREIGN KEY (course_id) REFERENCES course(course_id)
);

CREATE TABLE topic (
	topic_id INT AUTO_INCREMENT PRIMARY KEY,
    module_id INT , 
    topic_name varchar (100),
    lecture_file VARCHAR(200),
    FOREIGN KEY (module_id) REFERENCES module(module_id)
);

CREATE TABLE program (
    program_id INT AUTO_INCREMENT PRIMARY KEY,
    program_name varchar (50),
);

CREATE TABLE program_plan (
    program_plan_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT, 
    program_id INT, 
    program_name varchar (50),
    start_date varchar(15),
    end_date varchar(15),
    FOREIGN KEY (course_id) REFERENCES course(course_id),
    FOREIGN KEY (program_id) REFERENCES program(program_id)
);

CREATE TABLE time_table (
    time_table_id INT AUTO_INCREMENT PRIMARY KEY,
    program_plan_id INT,
    class_date varchar(15),
    class_time varchar(15),
    FOREIGN KEY (program_plan_id) REFERENCES program_plan(program_plan_id)
);

CREATE TABLE quiz (
    quiz_id INT AUTO_INCREMENT PRIMARY KEY,
    program_plan_id INT,
    quiz_date varchar(15),
    FOREIGN KEY (program_plan_id) REFERENCES program_plan(program_plan_id)
);

CREATE TABLE quiz_question (
    quiz_question_id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT,
    question varchar(500),
    option_1 varchar(50),
    option_2 varchar(50),
    option_3 varchar(50),
    option_4 varchar(50),
    question_picture varchar(50),
    FOREIGN KEY (quiz_id) REFERENCES quiz(quiz_id)
);

CREATE TABLE student_enrollment (
    student_enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    program_plan_id INT,
    student_id INT,
    enrollment_date varchar(15),
    program_status varchar(20),
    FOREIGN KEY (program_plan_id) REFERENCES program_plan(program_plan_id),
    FOREIGN KEY (student_id) REFERENCES student(student_id)
);




ALTER TABLE users MODIFY profile_picture VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
























