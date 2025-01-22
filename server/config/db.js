const mongoose = require("mongoose");

const connectDB  = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`connected to database : ${conn.connection.host}` .white.bold)
        
    } catch (error) {
        console.log(error)
        // exit(1);
    }
}

module.exports = connectDB;