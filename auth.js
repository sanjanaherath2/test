const jwt = require('jsonwebtoken');
const config = require('./config');
const mysql = require('mysql');

module.exports =(req,res,next) =>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, config.secret);
        req.data = decoded;
        console.log(decoded.userID);
        next();
    } catch (error){
        return res.status(401).json({
            message: "auth failed"
        });
    }

}