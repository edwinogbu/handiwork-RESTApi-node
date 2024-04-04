const multer = require('multer');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Uploads will be stored in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generate a unique filename
        cb(null, uniqueSuffix + '-' + file.originalname); // Filename format: <timestamp>-<originalname>
    }
});

// File filter to accept only image files
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/tiff',
        'image/psd',
        'image/raw',
        'image/bmp',
        'image/heif',
        'image/indd',
        'image/jp2',
        'image/svg+xml'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

// Multer upload instance
const upload = multer({ storage: storage, fileFilter: fileFilter });

// Middleware function to handle file upload
const uploadMiddleware = upload.single('image'); // Assuming the field name for the image is 'image'

module.exports = uploadMiddleware;


// const multer = require('multer');

// // Multer storage configuration
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/'); // Uploads will be stored in the 'uploads' directory
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generate a unique filename
//         cb(null, uniqueSuffix + '-' + file.originalname); // Filename format: <timestamp>-<originalname>
//     }
// });

// // File filter to accept only image files
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only image files are allowed'), false);
//     }
// };

// // Multer upload instance
// const upload = multer({ storage: storage, fileFilter: fileFilter });

// // Middleware function to handle file upload
// const uploadMiddleware = upload.single('image'); // Assuming the field name for image is 'image'

// module.exports = uploadMiddleware;

