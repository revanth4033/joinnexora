const path = require('path');
const multer = require('multer');

// Use local disk storage for both development and production
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = file.mimetype.startsWith('video/') ? 'uploads/videos' : 'uploads/images';
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit for videos
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Please upload only images or videos'), false);
    }
  },
});

module.exports = upload;
