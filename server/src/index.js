const dotenv = require("dotenv");
const color = require("colors");
const connectDB = require("./config/db.js");
const { app } = require("./app.js");
const PORT = process.env.PORT || 8000;

dotenv.config({
  path: "./env",
});

app.on("error", (error) => {
  console.log("ERROR", error);
  throw error;
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`.cyan.bold);
    });
  })
  .catch((err) => {
    console.log("database connection error !! ", err);
  });
