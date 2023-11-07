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

