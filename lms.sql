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

