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
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

// Multer upload instance
const upload = multer({ storage: storage, fileFilter: fileFilter });

// Middleware function to handle file upload
const uploadMiddleware = upload.single('image'); // Assuming the field name for image is 'image'

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


// //middlewares/uploadMiddleware.js
// const multer = require('multer');
// const path = require('path'); // Import the path module

// // Set storage engine
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Define the destination folder for uploaded files
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname); // Define the file name for the uploaded file
//   }
// });

// // Init upload
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 50 // Set file size limit (50MB in this example)
//   },
//   fileFilter: (req, file, cb) => {
//     checkFileType(file, cb);
//   }
// }).single('file');

// // Check file type
// function checkFileType(file, cb) {
//   // Allowed file extensions
//   const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|csv|gif|mp4/;
//   // Check the file extension
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // Check the MIME type
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb('Error: Invalid file type!');
//   }
// }

// module.exports = upload;

// const multer = require('multer');
// const path = require('path');

// // Multer storage configuration
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/'); // Define the destination folder where files will be stored
//     },
//     filename: function (req, file, cb) {
//         // Define the filename. You can customize it as needed.
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });

// // Define file filter function to accept only certain file types
// const fileFilter = (req, file, cb) => {
//     // Allowed file types
//     const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true); // Accept file
//     } else {
//         cb(new Error('Invalid file type. Only JPEG, PNG, and GIF files are allowed.'), false); // Reject file
//     }
// };

// // Initialize multer middleware
// const upload = multer({ 
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 5 // Set file size limit (5MB)
//     },
//     fileFilter: fileFilter // Apply file filter
// }).single('image');

// module.exports = upload;


// const multer = require('multer');
// const path = require('path');

// // Multer storage configuration
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/'); // Define the destination folder where files will be stored
//     },
//     filename: function (req, file, cb) {
//         // Define the filename. You can customize it as needed.
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });

// // Initialize multer middleware
// const upload = multer({ 
//     storage: storage,
//     limits: { fileSize: 1024 * 1024 * 5 } // Limit file size to 5MB (adjust as needed)
// }).single('image'); // Specify the field name for file upload

// module.exports = { upload };


// const multer = require('multer');
// const path = require('path');

// // Multer storage configuration
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads'); // Destination folder for uploaded images
//     },
//     filename: function (req, file, cb) {
//         // Rename uploaded files to prevent conflicts
//         cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
//     }
// });

// // Multer upload configuration
// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 5 // Limit file size to 5MB
//     }
// });

// module.exports = upload;


// const multer = require('multer');

// // Set storage engine
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });

// // Init upload
// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 50 // 50MB file size limit
//     },
//     fileFilter: (req, file, cb) => {
//         // File type validation logic
//     }
// });

// module.exports = upload;


// //middlewares/uploadMiddleware.js
// const multer = require('multer');
// const path = require('path'); // Import the path module

// // Set storage engine
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Define the destination folder for uploaded files
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname); // Define the file name for the uploaded file
//   }
// });

// // Init upload
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 50 // Set file size limit (50MB in this example)
//   },
//   fileFilter: (req, file, cb) => {
//     checkFileType(file, cb);
//   }
// }).single('file');

// // Check file type
// function checkFileType(file, cb) {
//   // Allowed file extensions
//   const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|csv|gif|mp4/;
//   // Check the file extension
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // Check the MIME type
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb('Error: Invalid file type!');
//   }
// }

// module.exports = upload;


// //middlewares/uploadMiddleware.js
// const multer = require('multer');

// // Set storage engine
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Define the destination folder for uploaded files
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname); // Define the file name for the uploaded file
//   }
// });

// // Init upload
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 50 // Set file size limit (50MB in this example)
//   },
//   fileFilter: (req, file, cb) => {
//     checkFileType(file, cb);
//   }
// }).single('file');

// // Check file type
// function checkFileType(file, cb) {
//   // Allowed file extensions
//   const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
//   // Check the file extension
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // Check the MIME type
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb('Error: Invalid file type!');
//   }
// }

// module.exports = upload;


// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Set storage engine
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     try {
//       const userId = req.user.id;
//       const folderName = req.params.folderName || 'defaultFolder'; // Provide a default folder name if not present
//       const userFolder = path.join(__dirname, `../uploads/${userId}`);
//       const folderPath = path.join(userFolder, folderName);

//       // Create the user folder if it doesn't exist
//       if (!fs.existsSync(userFolder)) {
//         fs.mkdirSync(userFolder);
//       }

//       // Create the folder if it doesn't exist
//       if (!fs.existsSync(folderPath)) {
//         fs.mkdirSync(folderPath);
//       }

//       cb(null, folderPath);
//     } catch (error) {
//       cb(error); // Pass the error to Multer
//     }
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// // Check file type
// function checkFileType(file, cb) {
//   // Allowed extensions
//   const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
//   // Check the extension
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // Check the mime type
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb('Error: Invalid file type!');
//   }
// }

// // Init upload
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 50, // 50MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     checkFileType(file, cb);
//   },
// }).single('file');

// module.exports = upload;


// const multer = require('multer');


// const path = require('path');
// const fs = require('fs');

// // Set storage engine
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     try {
//       const userId = req.user.id;
//       const folderName = req.params.folderName || 'defaultFolder'; // Provide a default folder name if not present
//       const userFolder = path.join(__dirname, `../uploads/${userId}`);
//       const folderPath = path.join(userFolder, folderName);

//       // Create the user folder if it doesn't exist
//       if (!fs.existsSync(userFolder)) {
//         fs.mkdirSync(userFolder);
//       }

//       // Create the folder if it doesn't exist
//       if (!fs.existsSync(folderPath)) {
//         fs.mkdirSync(folderPath);
//       }

//       cb(null, folderPath);
//     } catch (error) {
//       cb(error, null);
//     }
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// // Check file type
// function checkFileType(file, cb) {
//   // Allowed extensions
//   const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
//   // Check the extension
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // Check the mime type
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb('Error: Invalid file type!');
//   }
// }

// // Init upload
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 50, // 50MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     checkFileType(file, cb);
//   },
// }).single('file');

// module.exports = upload;


// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Set storage engine
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     try {
//       const userId = req.user.id;
//       const folderName = req.params.folderName;
//       const userFolder = path.join(__dirname, `../uploads/${userId}`);
//       const folderPath = path.join(userFolder, folderName);

//       // Create the user folder if it doesn't exist
//       if (!fs.existsSync(userFolder)) {
//         fs.mkdirSync(userFolder);
//       }

//       // Create the folder if it doesn't exist
//       if (!fs.existsSync(folderPath)) {
//         fs.mkdirSync(folderPath);
//       }

//       cb(null, folderPath);
//     } catch (error) {
//       cb(error, null);
//     }
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// // Check file type
// function checkFileType(file, cb) {
//   // Allowed extensions
//   const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
//   // Check the extension
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // Check the mime type
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb('Error: Invalid file type!');
//   }
// }

// // Init upload
// const uploadMiddleware = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 50, // 50MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     checkFileType(file, cb);
//   },
// }).single('file');

// module.exports = uploadMiddleware;




// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Set storage engine
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const userId = req.user.id;
//     const folderName = req.params.folderName;
//     const userFolder = path.join(__dirname, `../uploads/${userId}`);
//     const folderPath = path.join(userFolder, folderName);

//     // Create the user folder if it doesn't exist
//     if (!fs.existsSync(userFolder)) {
//       fs.mkdirSync(userFolder);
//     }

//     // Create the folder if it doesn't exist
//     if (!fs.existsSync(folderPath)) {
//       fs.mkdirSync(folderPath);
//     }

//     cb(null, folderPath);
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// // Check file type
// function checkFileType(file, cb) {
//   // Allowed extensions
//   const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
//   // Check the extension
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // Check the mime type
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb('Error: Invalid file type!');
//   }
// }

// // Init upload
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 50, // 50MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     checkFileType(file, cb);
//   },
// }).single('file');

// module.exports = upload;


// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Set storage engine
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const userId = req.user.id;
//     const folderName = req.params.folderName;
//     const userFolder = path.join(__dirname, `../uploads/${userId}`);
//     const folderPath = path.join(userFolder, folderName);

//     // Create the user folder if it doesn't exist
//     if (!fs.existsSync(userFolder)) {
//       fs.mkdirSync(userFolder);
//     }

//     // Create the folder if it doesn't exist
//     if (!fs.existsSync(folderPath)) {
//       fs.mkdirSync(folderPath);
//     }

//     cb(null, folderPath);
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// // Check file type
// function checkFileType(file, cb) {
//   // Allowed extensions
//   const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
//   // Check the extension
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // Check the mime type
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb('Error: Invalid file type!');
//   }
// }

// // Init upload
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 50, // 50MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     checkFileType(file, cb);
//   },
// }).single('file');

// module.exports = upload;
