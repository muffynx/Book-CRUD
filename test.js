import jwt from 'jsonwebtoken';

const payload = { userId: "123", role: "admin" };
const secret = "your_jwt_secret_key_here";
const options = { expiresIn: "1h" };

const token = jwt.sign(payload, secret, options);
console.log("Your JWT:", token);
console.log("Decoded JWT:", jwt.decode(token));