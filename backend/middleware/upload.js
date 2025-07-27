const path = require('path');
const multer = require('multer');

let storage;
if (process.env.NODE_ENV === 'production') {
  // Use Wasabi/S3 storage in production
  const AWS = require('aws-sdk');
  const multerS3 = require('multer-s3');
  const wasabi = new AWS.S3({
    endpoint: new AWS.Endpoint(process.env.WASABI_ENDPOINT || 's3.wasabisys.com'),
    accessKeyId: process.env.WASABI_ACCESS_KEY,
    secretAccessKey: process.env.WASABI_SECRET_KEY,
    region: process.env.WASABI_REGION || 'us-east-1',
    s3ForcePathStyle: true
  });
  storage = multerS3({
    s3: wasabi,
    bucket: process.env.WASABI_BUCKET_NAME,
    acl: 'public-read',
    key: function (req, file, cb) {
      const folder = file.mimetype.startsWith('video/') ? 'videos' : 'images';
      const fileName = `${folder}/${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE
  });
} else {
  // Use local disk storage in development
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const folder = file.mimetype.startsWith('video/') ? 'uploads/videos' : 'uploads/images';
      cb(null, folder);
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
}

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
