const { sign, verify } = require("jsonwebtoken");
require('dotenv').config();

const SECRET = process.env.JWT_SECRET || "123456789abcdefghi";

const generateToken = (user_id, role, admin_type) => {
    const payload = {
        user: user_id,
        role: role,
        admin_type: admin_type
    };

    // You may want to customize the expiresIn value based on your requirements
    const options = {
        expiresIn: "20d"
    };

    const token = sign(payload, SECRET, options);
    return token;
};


const validateToken = async (req, res, next) => {

    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            return res.status(401).json("Authorization header missing");
        }
        const token = authHeader.split(' ')[1]; // Extract the token from the header
        const validToken = await verify(token, SECRET);
        if (!validToken) {
            return res.status(401).json("Token verification failed");
        }
        req.user = validToken.user;
        next();
    } catch (error) {
        return res.status(500).json("Internal Server Error: " + error.message);
    }
}

module.exports = { generateToken, validateToken };
