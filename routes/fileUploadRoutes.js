const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, file.fieldname + '-' + Date.now());
    filepath =
      datetimestamp +
      '.' +
      file.originalname.split('.')[file.originalname.split('.').length - 1];
    cb(null, filepath);
  },
});
const fileFilter = (req, file, cb) => {
  //reject a filey
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});

// controllers section

const { fileUploadController } = require('../controllers/fileUploadController');

// Route to upload multiple image
router.post(
  '/images',
  single.array('productImages'),
  videoCtrl.upload_video_product
);

module.exports = router;
