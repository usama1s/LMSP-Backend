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