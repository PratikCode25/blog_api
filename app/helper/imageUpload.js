const multer = require('multer');
const path = require('path');


const file_type = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    const isValid = file_type[file.mimetype];
    let uploadError = new Error('Error in upload');
    if (isValid) {
      uploadError = null
    }

    cb(uploadError, 'uploads')
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(' ').join('-');
    const newFileName = path.parse(fileName).name;
    const extension = file_type[file.mimetype];
    cb(null, `${newFileName}-${Date.now()}.${extension}`);
  }
})

const imageUpload = multer({ storage: storage })

module.exports = imageUpload;