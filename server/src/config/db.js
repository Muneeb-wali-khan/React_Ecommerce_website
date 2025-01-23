const mongoose = require("mongoose");
const colors = require("colors");

const connectDB  = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`connected to database : ${conn.connection.host}`.red.underline)
        
    } catch (error) {
        console.log(error)
        // exit(1);
    }
}

module.exports = connectDB;