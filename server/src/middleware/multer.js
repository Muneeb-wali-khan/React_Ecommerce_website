const multer = require("multer");
const path = require("path")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
    // cb(null, "/tmp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// kb * byte 1kb  = 1024 byte
const fileSize = 500 * 1024; // = 300kb

const fileFilterIMAGE = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image is allowed !"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: fileSize },
  fileFilter: fileFilterIMAGE,
});


module.exports  = upload