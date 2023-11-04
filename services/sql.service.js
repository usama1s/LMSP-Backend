// sql-queries.js

// Define your SQL queries as named constants
const REGISTER_USER = `
  INSERT INTO users
  (profile_picture, email, password, role, marital_status, country, organization, designation, qualification, register_date)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

module.exports = {
  REGISTER_USER, // Export your SQL queries
};
