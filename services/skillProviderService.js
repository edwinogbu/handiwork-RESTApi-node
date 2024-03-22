// const mysql = require('mysql');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const axios = require('axios');
// const dotenv = require('dotenv');

// dotenv.config();

// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });

// // Helper function to execute SQL queries
// function query(sql, args) {
//     return new Promise((resolve, reject) => {
//         connection.query(sql, args, (err, rows) => {
//             if (err) reject(err);
//             else resolve(rows);
//         });
//     });
// }

// // Function to sign JWT token
// const signToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN,
//     });
// };



// // async function geocodeAddress(address) {
// //     try {
// //         const apiKey = process.env.GOOGLE_MAPS_API_KEY;
// //         const encodedAddress = encodeURIComponent(address);
// //         const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

// //         const response = await axios.get(url);

// //         if (response.data.status !== 'OK') {
// //             throw new Error('Failed to geocode address');
// //         }

// //         const location = response.data.results[0].geometry.location;
// //         const latitude = location.lat;
// //         const longitude = location.lng;

// //         return { latitude, longitude };
// //     } catch (error) {
// //         throw new Error('Failed to geocode address: ' + error.message);
// //     }
// // }



// async function geocodeAddress(address) {
//     try {
//         const apiKey = process.env.GOOGLE_MAPS_API_KEY;
//         const encodedAddress = encodeURIComponent(address);
//         const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

//         const response = await axios.get(url);

//         if (response.data.status !== 'OK') {
//             throw new Error(`Failed to geocode address: ${response.data.error_message}`);
//         }

//         const location = response.data.results[0].geometry.location;
//         const latitude = location.lat;
//         const longitude = location.lng;

//         return { latitude, longitude };
//     } catch (error) {
//         throw new Error('Failed to geocode address: ' + error.message);
//     }
// }


// // Create SkillProviders table if it doesn't exist
// async function createSkillProvidersTable() {
//     const createSkillProvidersTableQuery = `
//         CREATE TABLE IF NOT EXISTS skill_providers (
//             id INT AUTO_INCREMENT PRIMARY KEY,
//             firstName VARCHAR(255) NOT NULL,
//             lastName VARCHAR(255) NOT NULL,
//             email VARCHAR(255) NOT NULL UNIQUE,
//             password VARCHAR(255) NOT NULL,
//             phone VARCHAR(20),
//             state VARCHAR(255) NOT NULL,
//             city VARCHAR(255) NOT NULL,
//             street VARCHAR(255) NOT NULL,
//             address VARCHAR(255),
//             serviceCategory VARCHAR(255),
//             subCategory VARCHAR(255),
//             openingHour VARCHAR(255),
//             referralCode VARCHAR(255),
//             imagePath VARCHAR(255),
//             userId INT NOT NULL,
//             FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
//             latitude DECIMAL(10, 8),
//             longitude DECIMAL(11, 8),
//             createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//         );
//     `;
//     try {
//         await query(createSkillProvidersTableQuery);
//         console.log('SkillProviders table created successfully');
//     } catch (error) {
//         console.error('Error creating SkillProviders table:', error);
//         throw error;
//     }
// }

// createSkillProvidersTable(); // Immediately create the table on module load

// const skillProviderService = {};



// skillProviderService.createSkillProvider = async (skillProviderData) => {
//     try {
//         const { firstName, lastName, email, password, phone, state, city, street, serviceCategory, subCategory, openingHour, referralCode } = skillProviderData;

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 12);

//         // Construct full address
//         const address = `${street}, ${city}, ${state}`; // Correct order for address components

//         // Geocode the address using Google Maps Geocoding API
//         const { latitude, longitude } = await geocodeAddress(address);

//         // Create new user
//         const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
//         const newUserResult = await query(newUserQuery, [email, email, hashedPassword, 'user', 'SkillProvider']);

//         // Generate JWT token
//         const token = signToken(newUserResult.insertId);

//         // Insert skillProvider data into the skill_providers table
//         const insertQuery = `
//             INSERT INTO skill_providers (firstName, lastName, email, password, phone, state, city, street, address, serviceCategory, subCategory, openingHour, referralCode, userId, latitude, longitude)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//         const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, state, city, street, address, serviceCategory, subCategory, openingHour, referralCode, newUserResult.insertId, latitude, longitude]);

//         return { id: result.insertId, token, ...skillProviderData, address, latitude, longitude };
//     } catch (error) {
//         throw error;
//     }
// };


// skillProviderService.getAllSkillProviders = async () => {
//     try {
//         const selectAllQuery = 'SELECT * FROM skill_providers';
//         const skillProviders = await query(selectAllQuery);
//         return skillProviders;
//     } catch (error) {
//         throw error;
//     }
// };

// skillProviderService.getSkillProviderById = async (id) => {
//     try {
//         const selectQuery = 'SELECT * FROM skill_providers WHERE id = ?';
//         const skillProviders = await query(selectQuery, [id]);
//         return skillProviders[0];
//     } catch (error) {
//         throw error;
//     }
// };

// skillProviderService.updateSkillProvider = async (id, updates) => {
//     try {
//         const updateQuery = `
//             UPDATE skill_providers
//             SET ?
//             WHERE id = ?
//         `;
//         await query(updateQuery, [updates, id]);
//         return { id, ...updates };
//     } catch (error) {
//         throw error;
//     }
// };

// skillProviderService.deleteSkillProvider = async (id) => {
//     try {
//         const deleteQuery = 'DELETE FROM skill_providers WHERE id = ?';
//         await query(deleteQuery, [id]);
//         return { id };
//     } catch (error) {
//         throw error;
//     }
// };

// // Find nearest skill providers based on latitude and longitude
// skillProviderService.findNearestSkillProviders = async (latitude, longitude, radius = 10) => {
//     try {
//         // Query to find skill providers within the specified radius (in kilometers)
//         const query = `
//             SELECT *, 
//                 (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance 
//             FROM skill_providers 
//             HAVING distance <= ?
//             ORDER BY distance;
//         `;
//         const skillProviders = await query(query, [latitude, longitude, latitude, radius]);

//         return skillProviders;
//     } catch (error) {
//         throw error;
//     }
// };

// module.exports = skillProviderService;



const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Helper function to execute SQL queries
function query(sql, args) {
    return new Promise((resolve, reject) => {
        connection.query(sql, args, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

// Function to sign JWT token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

// Function to get IP info from apiip.net API
async function getIpInfo(ip, accessKey) {
    try {
        const url = `https://apiip.net/api/check?ip=${ip}&accessKey=${accessKey}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Geocode address using IP info
async function geocodeAddress(address) {
    try {
        const ip = '41.63.68.0'; // Default IP for geolocation
        const ipInfo = await getIpInfo(ip, process.env.APIIP_ACCESS_KEY);
        const latitude = ipInfo.latitude;
        const longitude = ipInfo.longitude;
        return { latitude, longitude };
    } catch (error) {
        throw error;
    }
}



async function googleGeoCodeAddress(address) {
    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        const encodedAddress = encodeURIComponent(address);
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

        const response = await axios.get(url);

        if (response.data.status !== 'OK') {
            throw new Error(`Failed to geocode address: ${response.data.error_message}`);
        }

        const location = response.data.results[0].geometry.location;
        const latitude = location.lat;
        const longitude = location.lng;

        return { latitude, longitude };
    } catch (error) {
        throw new Error('Failed to geocode address: ' + error.message);
    }
}


// Create SkillProviders table if it doesn't exist
async function createSkillProvidersTable() {
    const createSkillProvidersTableQuery = `
        CREATE TABLE IF NOT EXISTS skill_providers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            firstName VARCHAR(255) NOT NULL,
            lastName VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            state VARCHAR(255) NOT NULL,
            city VARCHAR(255) NOT NULL,
            street VARCHAR(255) NOT NULL,
            address VARCHAR(255),
            serviceCategory VARCHAR(255),
            subCategory VARCHAR(255),
            openingHour VARCHAR(255),
            referralCode VARCHAR(255),
            imagePath VARCHAR(255),
            userId INT NOT NULL,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
            latitude DECIMAL(10, 8),
            longitude DECIMAL(11, 8),
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await query(createSkillProvidersTableQuery);
        console.log('SkillProviders table created successfully');
    } catch (error) {
        console.error('Error creating SkillProviders table:', error);
        throw error;
    }
}

createSkillProvidersTable(); // Immediately create the table on module load

const skillProviderService = {};


// skillProviderService.createSkillProvider = async (skillProviderData) => {
//     try {
//         const { firstName, lastName, email, password, phone, address, serviceType, serviceTypeCategory, openingHour, referralCode } = skillProviderData;

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 12);

//         // Create new user
//         const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
//         const newUserResult = await query(newUserQuery, [email, email, hashedPassword, 'user', 'SkillProvider']);

//         // Generate JWT token
//         const token = signToken(newUserResult.insertId);

//         // Now that the user is created, insert skillProvider data into the skill_providers table
//         const insertQuery = `
//             INSERT INTO skill_providers (firstName, lastName, email, password, phone, address, serviceType, serviceTypeCategory, openingHour, referralCode, userId)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//         const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, address, serviceType, serviceTypeCategory, openingHour, referralCode, newUserResult.insertId]);

//         // Return the newly created skillProvider data along with the user token
//         return { id: result.insertId, token, ...skillProviderData };
//     } catch (error) {
//         throw error;
//     }
// };


skillProviderService.createSkillProvider = async (skillProviderData) => {
    try {
        const { firstName, lastName, email, password, phone, state, city, street, serviceCategory, subCategory, openingHour, referralCode } = skillProviderData;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Geocode the address
        const address = `${state}, ${city}, ${street}`;
        const { latitude, longitude } = await geocodeAddress(address);

        // Create new user
        const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
        const newUserResult = await query(newUserQuery, [email, email, hashedPassword, 'user', 'SkillProvider']);

        // Generate JWT token
        const token = signToken(newUserResult.insertId);

        // Insert skillProvider data into the skill_providers table
        const insertQuery = `
            INSERT INTO skill_providers (firstName, lastName, email, password, phone, state, city, street, address, serviceCategory, subCategory, openingHour, referralCode, userId, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, state, city, street, address, serviceCategory, subCategory, openingHour, referralCode, newUserResult.insertId, latitude, longitude]);

        return { id: result.insertId, token, ...skillProviderData, address, latitude, longitude };
    } catch (error) {
        throw error;
    }
};



skillProviderService.createSkillProviderWithGoogle = async (skillProviderData) => {
    try {
        const { firstName, lastName, email, password, phone, state, city, street, serviceCategory, subCategory, openingHour, referralCode } = skillProviderData;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Construct full address
        const address = `${street}, ${city}, ${state}`; // Correct order for address components

        // Geocode the address using Google Maps Geocoding API
        const { latitude, longitude } = await googleGeoCodeAddress(address);

        // Create new user
        const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
        const newUserResult = await query(newUserQuery, [email, email, hashedPassword, 'user', 'SkillProvider']);

        // Generate JWT token
        const token = signToken(newUserResult.insertId);

        // Insert skillProvider data into the skill_providers table
        const insertQuery = `
            INSERT INTO skill_providers (firstName, lastName, email, password, phone, state, city, street, address, serviceCategory, subCategory, openingHour, referralCode, userId, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, state, city, street, address, serviceCategory, subCategory, openingHour, referralCode, newUserResult.insertId, latitude, longitude]);

        return { id: result.insertId, token, ...skillProviderData, address, latitude, longitude };
    } catch (error) {
        throw error;
    }
};



skillProviderService.getAllSkillProviders = async () => {
    try {
        const selectAllQuery = 'SELECT * FROM skill_providers';
        const skillProviders = await query(selectAllQuery);
        return skillProviders;
    } catch (error) {
        throw error;
    }
};

skillProviderService.getSkillProviderById = async (id) => {
    try {
        const selectQuery = 'SELECT * FROM skill_providers WHERE id = ?';
        const skillProviders = await query(selectQuery, [id]);
        return skillProviders[0];
    } catch (error) {
        throw error;
    }
};

skillProviderService.updateSkillProvider = async (id, updates) => {
    try {
        const updateQuery = `
            UPDATE skill_providers
            SET ?
            WHERE id = ?
        `;
        await query(updateQuery, [updates, id]);
        return { id, ...updates };
    } catch (error) {
        throw error;
    }
};



const multer = require('multer'); // Import multer for handling file uploads
const path = require('path');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Define destination folder for uploads
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Define file name
    }
});

// Multer file filter
const fileFilter = (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Update skill provider profile including image upload
// skillProviderService.updateSkillProviderProfileWithImage = async (id, updates, image) => {
//     try {
//         // If image is provided, upload it
//         let imagePath = null;
//         if (image) {
//             // Handle image upload
//             await upload.single('image')(null, null, async function(err) {
//                 if (err) throw new Error(err.message);
//             });
//             imagePath = 'uploads/' + image.filename;
//         }

//         // Update skill provider information in the database
//         const updateQuery = `
//             UPDATE skill_providers
//             SET ?, imagePath = ?
//             WHERE id = ?
//         `;
//         await query(updateQuery, [updates, imagePath, id]);

//         // Return the updated skill provider information
//         const updatedProfile = await skillProviderService.getSkillProviderById(id);
//         return updatedProfile;
//     } catch (error) {
//         throw error;
//     }
// };

// Update skill provider profile including image upload
// skillProviderService.updateSkillProviderProfileWithImage = async (id, updates, image) => {
//     try {
//         // If image is provided, upload it
//         let imagePath = null;
//         if (image) {
//             // Handle image upload
//             await upload.single('image')(null, null, async function(err) {
//                 if (err) throw new Error(err.message);
//             });
//             imagePath = 'uploads/' + image.filename;
//         }

//         // Construct the SQL update query dynamically
//         let updateQuery = 'UPDATE skill_providers SET ';
//         const updateParams = [];
//         Object.keys(updates).forEach((key) => {
//             updateQuery += `${key} = ?, `;
//             updateParams.push(updates[key]);
//         });
//         // Add imagePath to the update parameters
//         updateQuery += `imagePath = ? WHERE id = ?`;
//         updateParams.push(imagePath, id);

//         // Execute the SQL update query
//         await query(updateQuery, updateParams);

//         // Return the updated skill provider information
//         const updatedProfile = await skillProviderService.getSkillProviderById(id);
//         return updatedProfile;
//     } catch (error) {
//         throw error;
//     }
// };




// Update skill provider profile including image upload
// Update skill provider profile including image upload
// Update skill provider profile including image upload
skillProviderService.updateSkillProviderProfileWithImage = async (id, updates, imagePath) => {
    try {
        // Construct the SQL update query
        let updateQuery = 'UPDATE skill_providers SET ';
        const updateValues = [];
        for (const key in updates) {
            updateQuery += `${key} = ?, `;
            updateValues.push(updates[key]);
        }
        if (imagePath) {
            updateQuery += 'imagePath = ? ';
            updateValues.push(imagePath);
        }
        updateQuery += 'WHERE id = ?';
        updateValues.push(id);

        // Execute the SQL update query
        await query(updateQuery, updateValues);

        // Return the updated skill provider information
        const updatedProfile = await skillProviderService.getSkillProviderById(id);
        return updatedProfile;
    } catch (error) {
        throw error;
    }
};

// Function to handle image upload using multer
const uploadImage = async (image) => {
    return new Promise((resolve, reject) => {
        upload.single('image')(image, null, async function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ path: 'uploads/' + image.filename });
            }
        });
    });
};

// Update skill provider profile including image upload
// skillProviderService.updateSkillProviderProfileWithImage = async (id, updates, image) => {
//     try {
//         // If image is provided, upload it
//         let imagePath = null;
//         if (image) {
//             // Handle image upload
//             await upload.single('image')(null, null, async function(err) {
//                 if (err) throw new Error(err.message);
//             });
//             imagePath = 'uploads/' + image.filename;
//         }

//         // Update skill provider information in the database
//         const updateQuery = `
//             UPDATE skill_providers
//             SET ?, imagePath = ?
//             WHERE id = ?
//         `;
//         await query(updateQuery, [updates, imagePath, id]);

//         // Return the updated skill provider information
//         const updatedProfile = await skillProviderService.getSkillProviderById(id);
//         return updatedProfile;
//     } catch (error) {
//         throw error;
//     }
// };



skillProviderService.deleteSkillProvider = async (id) => {
    try {
        const deleteQuery = 'DELETE FROM skill_providers WHERE id = ?';
        await query(deleteQuery, [id]);
        return { id };
    } catch (error) {
        throw error;
    }
};

// Find nearest skill providers based on latitude and longitude
skillProviderService.findNearestSkillProviders = async (latitude, longitude, radius = 10) => {
    try {
        // Query to find skill providers within the specified radius (in kilometers)
        const query = `
            SELECT *, 
                (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance 
            FROM skill_providers 
            HAVING distance <= ?
            ORDER BY distance;
        `;
        const skillProviders = await query(query, [latitude, longitude, latitude, radius]);

        return skillProviders;
    } catch (error) {
        throw error;
    }
};

module.exports = skillProviderService;


// const mysql = require('mysql');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const axios = require('axios');
// const dotenv = require('dotenv');

// dotenv.config();

// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });

// // Helper function to execute SQL queries
// function query(sql, args) {
//     return new Promise((resolve, reject) => {
//         connection.query(sql, args, (err, rows) => {
//             if (err) reject(err);
//             else resolve(rows);
//         });
//     });
// }

// // Function to sign JWT token
// const signToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN,
//     });
// };

// // Function to get IP info from apiip.net API
// async function getIpInfo(ip, accessKey) {
//     try {
//         const url = `https://apiip.net/api/check?ip=${ip}&accessKey=${accessKey}`;
//         const response = await axios.get(url);
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// }

// // 41.63.68.0	41.63.71.255 196.11.184.0
// // 
// async function geocodeAddress(address) {
//     try {
//         const ip = '41.63.68.0'
//         const ipInfo = await getIpInfo(address. ip, process.env.APIIP_ACCESS_KEY);
//         // const ipInfo = await getIpInfo('67.250.186.196', process.env.APIIP_ACCESS_KEY);
//         // Extract latitude and longitude from ipInfo
//         const latitude = ipInfo.latitude;
//         const longitude = ipInfo.longitude;
//         return { latitude, longitude };
//     } catch (error) {
//         throw error;
//     }
// }

// // Create SkillProviders table if it doesn't exist
// async function createSkillProvidersTable() {
//     const createSkillProvidersTableQuery = `
//         CREATE TABLE IF NOT EXISTS skill_providers (
//             id INT AUTO_INCREMENT PRIMARY KEY,
//             firstName VARCHAR(255) NOT NULL,
//             lastName VARCHAR(255) NOT NULL,
//             email VARCHAR(255) NOT NULL UNIQUE,
//             password VARCHAR(255) NOT NULL,
//             phone VARCHAR(20),
//             state VARCHAR(255) NOT NULL,
//             city VARCHAR(255) NOT NULL,
//             street VARCHAR(255) NOT NULL,
//             address VARCHAR(255),
//             serviceCategory VARCHAR(255),
//             subCategory VARCHAR(255),
//             openingHour VARCHAR(255),
//             referralCode VARCHAR(255),
//             imagePath VARCHAR(255),
//             userId INT NOT NULL,
//             FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
//             latitude DECIMAL(10, 8),
//             longitude DECIMAL(11, 8),
//             createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//         );
//     `;
//     try {
//         await query(createSkillProvidersTableQuery);
//         console.log('SkillProviders table created successfully');
//     } catch (error) {
//         console.error('Error creating SkillProviders table:', error);
//         throw error;
//     }
// }

// createSkillProvidersTable(); // Immediately create the table on module load

// const skillProviderService = {};

// skillProviderService.createSkillProvider = async (skillProviderData) => {
//     try {
//         const { firstName, lastName, email, password, phone, address, serviceCategory, subCategory, openingHour, referralCode } = skillProviderData;

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 12);

//         // Geocode the address
//         const { latitude, longitude } = await geocodeAddress(address);

//         // Create new user
//         const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
//         const newUserResult = await query(newUserQuery, [email, email, hashedPassword, 'user', 'SkillProvider']);

//         // Generate JWT token
//         const token = signToken(newUserResult.insertId);

//         // Insert skillProvider data into the skill_providers table
//         const insertQuery = `
//             INSERT INTO skill_providers (firstName, lastName, email, password, phone, address, serviceCategory, subCategory, openingHour, referralCode, userId, latitude, longitude)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//         const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, address, serviceCategory, subCategory, openingHour, referralCode, newUserResult.insertId, latitude, longitude]);

//         return { id: result.insertId, token, ...skillProviderData, latitude, longitude };
//     } catch (error) {
//         throw error;
//     }
// };

// skillProviderService.getAllSkillProviders = async () => {
//     try {
//         const selectAllQuery = 'SELECT * FROM skill_providers';
//         const skillProviders = await query(selectAllQuery);
//         return skillProviders;
//     } catch (error) {
//         throw error;
//     }
// };

// skillProviderService.getSkillProviderById = async (id) => {
//     try {
//         const selectQuery = 'SELECT * FROM skill_providers WHERE id = ?';
//         const skillProviders = await query(selectQuery, [id]);
//         return skillProviders[0];
//     } catch (error) {
//         throw error;
//     }
// };

// skillProviderService.updateSkillProvider = async (id, updates) => {
//     try {
//         const updateQuery = `
//             UPDATE skill_providers
//             SET ?
//             WHERE id = ?
//         `;
//         await query(updateQuery, [updates, id]);
//         return { id, ...updates };
//     } catch (error) {
//         throw error;
//     }
// };

// skillProviderService.deleteSkillProvider = async (id) => {
//     try {
//         const deleteQuery = 'DELETE FROM skill_providers WHERE id = ?';
//         await query(deleteQuery, [id]);
//         return { id };
//     } catch (error) {
//         throw error;
//     }
// };

// // Find nearest skill providers based on latitude and longitude
// skillProviderService.findNearestSkillProviders = async (latitude, longitude, radius = 10) => {
//     try {
//         // Query to find skill providers within the specified radius (in kilometers)
//         const query = `
//             SELECT *, 
//                 (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance 
//             FROM skill_providers 
//             HAVING distance <= ?
//             ORDER BY distance;
//         `;
//         const skillProviders = await query(query, [latitude, longitude, latitude, radius]);

//         return skillProviders;
//     } catch (error) {
//         throw error;
//     }
// };

// module.exports = skillProviderService;



// const mysql = require('mysql');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const axios = require('axios');
// const dotenv = require('dotenv');

// dotenv.config();

// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });

// // Helper function to execute SQL queries
// function query(sql, args) {
//     return new Promise((resolve, reject) => {
//         connection.query(sql, args, (err, rows) => {
//             if (err) reject(err);
//             else resolve(rows);
//         });
//     });
// }

// // Function to sign JWT token
// const signToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN,
//     });
// };

// // Geocode address using Google Maps Geocoding API
// async function geocodeAddress(address) {
//     try {
//         const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
//             params: {
//                 address: address,
//                 key: process.env.GOOGLE_MAPS_API_KEY,
//                 region: 'NG',
//             }
//         });

//         const results = response.data.results;
//         if (results && results.length > 0) {
//             const location = results[0].geometry.location;
//             const { lat, lng } = location;
//             return { latitude: lat, longitude: lng };
//         } else {
//             throw new Error('No results found for the provided address');
//         }
//     } catch (error) {
//         throw error;
//     }
// }

// // Create SkillProviders table if it doesn't exist
// async function createSkillProvidersTable() {
//     const createSkillProvidersTableQuery = `
//         CREATE TABLE IF NOT EXISTS skill_providers (
//             id INT AUTO_INCREMENT PRIMARY KEY,
//             firstName VARCHAR(255) NOT NULL,
//             lastName VARCHAR(255) NOT NULL,
//             email VARCHAR(255) NOT NULL UNIQUE,
//             password VARCHAR(255) NOT NULL,
//             phone VARCHAR(20),
//             address VARCHAR(255),
//             serviceCategory VARCHAR(255),
//             subCategory VARCHAR(255),
//             openingHour VARCHAR(255),
//             referralCode VARCHAR(255),
//             userId INT NOT NULL,
//             FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
//             latitude DECIMAL(10, 8),
//             longitude DECIMAL(11, 8),
//             createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//         );
//     `;
//     try {
//         await query(createSkillProvidersTableQuery);
//         console.log('SkillProviders table created successfully');
//     } catch (error) {
//         console.error('Error creating SkillProviders table:', error);
//         throw error;
//     }
// }

// createSkillProvidersTable(); // Immediately create the table on module load

// const skillProviderService = {};

// skillProviderService.createSkillProvider = async (skillProviderData) => {
//     try {
//         const { firstName, lastName, email, password, phone, address, serviceCategory, subCategory, openingHour, referralCode } = skillProviderData;

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 12);

//         // Geocode the address
//         const { latitude, longitude } = await geocodeAddress(address);

//         // Create new user
//         const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
//         const newUserResult = await query(newUserQuery, [email, email, hashedPassword, 'user', 'SkillProvider']);

//         // Generate JWT token
//         const token = signToken(newUserResult.insertId);

//         // Insert skillProvider data into the skill_providers table
//         const insertQuery = `
//             INSERT INTO skill_providers (firstName, lastName, email, password, phone, address, serviceCategory, subCategory, openingHour, referralCode, userId, latitude, longitude)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//         const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, address, serviceCategory, subCategory, openingHour, referralCode, newUserResult.insertId, latitude, longitude]);

//         return { id: result.insertId, token, ...skillProviderData, latitude, longitude };
//     } catch (error) {
//         throw error;
//     }
// };

// skillProviderService.getAllSkillProviders = async () => {
//     try {
//         const selectAllQuery = 'SELECT * FROM skill_providers';
//         const skillProviders = await query(selectAllQuery);
//         return skillProviders;
//     } catch (error) {
//         throw error;
//     }
// };

// skillProviderService.getSkillProviderById = async (id) => {
//     try {
//         const selectQuery = 'SELECT * FROM skill_providers WHERE id = ?';
//         const skillProviders = await query(selectQuery, [id]);
//         return skillProviders[0];
//     } catch (error) {
//         throw error;
//     }
// };

// skillProviderService.updateSkillProvider = async (id, updates) => {
//     try {
//         const updateQuery = `
//             UPDATE skill_providers
//             SET ?
//             WHERE id = ?
//         `;
//         await query(updateQuery, [updates, id]);
//         return { id, ...updates };
//     } catch (error) {
//         throw error;
//     }
// };

// skillProviderService.deleteSkillProvider = async (id) => {
//     try {
//         const deleteQuery = 'DELETE FROM skill_providers WHERE id = ?';
//         await query(deleteQuery, [id]);
//         return { id };
//     } catch (error) {
//         throw error;
//     }
// };



// // Find nearest skill providers based on latitude and longitude
// skillProviderService.findNearestSkillProviders = async (latitude, longitude, radius = 10) => {
//     try {
//         // Query to find skill providers within the specified radius (in kilometers)
//         const query = `
//             SELECT *, 
//                 (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance 
//             FROM skill_providers 
//             HAVING distance <= ?
//             ORDER BY distance;
//         `;
//         const skillProviders = await query(query, [latitude, longitude, latitude, radius]);

//         return skillProviders;
//     } catch (error) {
//         throw error;
//     }
// };


// module.exports = skillProviderService;


// const mysql = require('mysql');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const axios = require('axios');
// const dotenv = require('dotenv');

// dotenv.config();

// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });

// // Helper function to execute SQL queries
// function query(sql, args) {
//     return new Promise((resolve, reject) => {
//         connection.query(sql, args, (err, rows) => {
//             if (err) return reject(err);
//             resolve(rows);
//         });
//     });
// }

// // Function to sign JWT token
// const signToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN,
//     });
// };

// // Geocode address using Google Maps Geocoding API
// async function geocodeAddress(address) {
//     try {
//         const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
//             params: {
//                 address: address,
//                 key: process.env.GOOGLE_MAPS_API_KEY,
//             }
//         });

//         const results = response.data.results;
//         if (results && results.length > 0) {
//             const location = results[0].geometry.location;
//             const latitude = location.lat;
//             const longitude = location.lng;
//             return { latitude, longitude };
//         } else {
//             throw new Error('No results found for the provided address');
//         }
//     } catch (error) {
//         throw error;
//     }
// }

// const skillProviderService = {};

// // Create a new skill provider with latitude and longitude
// skillProviderService.createSkillProvider = async (skillProviderData) => {
//     try {
//         const { firstName, lastName, email, password, phone, address, serviceCategory, subCategory, openingHour, referralCode } = skillProviderData;

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 12);

//         // Geocode the address
//         const { latitude, longitude } = await geocodeAddress(address);

//         // Create new user
//         const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
//         const newUserResult = await query(newUserQuery, [email, email, hashedPassword, 'user', 'SkillProvider']);

//         // Generate JWT token
//         const token = signToken(newUserResult.insertId);

//         // Now that the user is created, insert skillProvider data into the skill_providers table
//         const insertQuery = `
//             INSERT INTO skill_providers (firstName, lastName, email, password, phone, address, serviceCategory, subCategory, openingHour, referralCode, userId, latitude, longitude)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//         const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, address, serviceCategory, subCategory, openingHour, referralCode, newUserResult.insertId, latitude, longitude]);

//         // Return the newly created skillProvider data along with the user token, latitude, and longitude
//         return { id: result.insertId, token, ...skillProviderData, latitude, longitude };
//     } catch (error) {
//         throw error;
//     }
// };

// // Get all skill providers
// skillProviderService.getAllSkillProviders = async () => {
//     try {
//         const selectAllQuery = 'SELECT * FROM skill_providers';
//         const skillProviders = await query(selectAllQuery);
//         return skillProviders;
//     } catch (error) {
//         throw error;
//     }
// };

// // Get a skill provider by ID
// skillProviderService.getSkillProviderById = async (id) => {
//     try {
//         const selectQuery = 'SELECT * FROM skill_providers WHERE id = ?';
//         const skillProviders = await query(selectQuery, [id]);
//         return skillProviders[0];
//     } catch (error) {
//         throw error;
//     }
// };

// // Update a skill provider by ID
// skillProviderService.updateSkillProvider = async (id, updates) => {
//     try {
//         const updateQuery = `
//             UPDATE skill_providers
//             SET ?
//             WHERE id = ?
//         `;
//         await query(updateQuery, [updates, id]);
//         return { id, ...updates };
//     } catch (error) {
//         throw error;
//     }
// };

// // Delete a skill provider by ID
// skillProviderService.deleteSkillProvider = async (id) => {
//     try {
//         const deleteQuery = 'DELETE FROM skill_providers WHERE id = ?';
//         await query(deleteQuery, [id]);
//         return { id };
//     } catch (error) {
//         throw error;
//     }
// };

// // Find nearest skill providers based on latitude and longitude
// skillProviderService.findNearestSkillProviders = async (latitude, longitude, radius = 10) => {
//     try {
//         // Query to find skill providers within the specified radius (in kilometers)
//         const query = `
//             SELECT *, 
//                 (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance 
//             FROM skill_providers 
//             HAVING distance <= ?
//             ORDER BY distance;
//         `;
//         const skillProviders = await query(query, [latitude, longitude, latitude, radius]);

//         return skillProviders;
//     } catch (error) {
//         throw error;
//     }
// };

// module.exports = skillProviderService;


// const mysql = require('mysql');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');

// dotenv.config();

// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });

// // Helper function to execute SQL queries
// function query(sql, args) {
//     return new Promise((resolve, reject) => {
//         connection.query(sql, args, (err, rows) => {
//             if (err) return reject(err);
//             resolve(rows);
//         });
//     });
// }

// // Create SkillProviders table if it doesn't exist
// const createSkillProvidersTableQuery = `
// CREATE TABLE IF NOT EXISTS skill_providers (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     firstName VARCHAR(255) NOT NULL,
//     lastName VARCHAR(255) NOT NULL,
//     email VARCHAR(255) NOT NULL UNIQUE,
//     password VARCHAR(255) NOT NULL,
//     phone VARCHAR(20),
//     address VARCHAR(255),
//     serviceCategory VARCHAR(255),
//     subCategory VARCHAR(255),
//     openingHour VARCHAR(255),
//     referralCode VARCHAR(255),
//     userId INT NOT NULL,
//     FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
//     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// `;

// connection.query(createSkillProvidersTableQuery, (err, result) => {
//     if (err) {
//         console.error('Error creating skill_providers table:', err);
//         return;
//     }
//     console.log('SkillProviders table created successfully');
// });

// // Function to sign JWT token
// const signToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN,
//     });
// };

// // CRUD operations for SkillProviders
// const skillProviderService = {};

// skillProviderService.createSkillProvider = async (skillProviderData) => {
//     try {
//         const { firstName, lastName, email, password, phone, address, serviceCategory, subCategory, openingHour, referralCode } = skillProviderData;

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 12);

//         // Create new user
//         const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
//         const newUserResult = await query(newUserQuery, [email, email, hashedPassword, 'user', 'SkillProvider']);

//         // Generate JWT token
//         const token = signToken(newUserResult.insertId);

//         // Now that the user is created, insert skillProvider data into the skill_providers table
//         const insertQuery = `
//             INSERT INTO skill_providers (firstName, lastName, email, password, phone, address, serviceCategory, subCategory, openingHour, referralCode, userId)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//         const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, address, serviceCategory, subCategory, openingHour, referralCode, newUserResult.insertId]);

//         // Return the newly created skillProvider data along with the user token
//         return { id: result.insertId, token, ...skillProviderData };
//     } catch (error) {
//         throw error;
//     }
// };

// skillProviderService.getAllSkillProviders = async () => {
//     try {
//         const selectAllQuery = 'SELECT * FROM skill_providers';
//         const skillProviders = await query(selectAllQuery);
//         return skillProviders;
//     } catch (error) {
//         throw error;
//     }
// };

// skillProviderService.getSkillProviderById = async (id) => {
//     try {
//         const selectQuery = 'SELECT * FROM skill_providers WHERE id = ?';
//         const skillProviders = await query(selectQuery, [id]);
//         return skillProviders[0];
//     } catch (error) {
//         throw error;
//     }
// };

// skillProviderService.updateSkillProvider = async (id, updates) => {
//     try {
//         const updateQuery = `
//             UPDATE skill_providers
//             SET ?
//             WHERE id = ?
//         `;
//         await query(updateQuery, [updates, id]);
//         return { id, ...updates };
//     } catch (error) {
//         throw error;
//     }
// };

// skillProviderService.deleteSkillProvider = async (id) => {
//     try {
//         const deleteQuery = 'DELETE FROM skill_providers WHERE id = ?';
//         await query(deleteQuery, [id]);
//         return { id };
//     } catch (error) {
//         throw error;
//     }
// };

// // Export the service object
// module.exports = skillProviderService;


// const mysql = require('mysql');
// const dotenv = require('dotenv');

// dotenv.config();

// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });

// // Helper function to execute SQL queries
// function query(sql, args) {
//     return new Promise((resolve, reject) => {
//         connection.query(sql, args, (err, rows) => {
//             if (err) return reject(err);
//             resolve(rows);
//         });
//     });
// }

// // Create SkillProviders table if it doesn't exist
// const createSkillProvidersTableQuery = `
// CREATE TABLE IF NOT EXISTS skill_providers (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     firstName VARCHAR(255) NOT NULL,
//     lastName VARCHAR(255) NOT NULL,
//     il VARCHAR(255) NOT NULL UNIQUE,
//     password VARCHAR(255) NOT NULL,
//     phone VARCHAR(20),
//     address VARCHAR(255),
//     serviceCategory VARCHAR(255),
//     subCategory VARCHAR(255),
//     openingHour VARCHAR(255),
//     referralCode VARCHAR(255),
//     userId INT NOT NULL,
//     FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
//     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// `;

// connection.query(createSkillProvidersTableQuery, (err, result) => {
//     if (err) {
//         console.error('Error creating skill_providers table:', err);
//         return;
//     }
//     console.log('SkillProviders table created successfully');
// });

// // CRUD operations for SkillProviders
// const skillProviderService = {};

// skillProviderService.createSkillProvider = async (skillProviderData) => {
//     try {
//         const { firstName, lastName, email, phone, address, serviceCategory, subCategory, openingHour, referralCode, userId } = skillProviderData;
//         const insertQuery = `
//             INSERT INTO skill_providers (firstName, lastName, email, phone, address, serviceCategory, subCategory, openingHour, referralCode, userId)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//         const result = await query(insertQuery, [firstName, lastName, email, phone, address, serviceCategory, subCategory, openingHour, referralCode, userId]);
//         return { id: result.insertId, ...skillProviderData };
//     } catch (error) {
//         throw error;
//     }
// };

// skillProviderService.getSkillProviderById = async (id) => {
//     try {
//         const selectQuery = 'SELECT * FROM skill_providers WHERE id = ?';
//         const skillProviders = await query(selectQuery, [id]);
//         return skillProviders[0];
//     } catch (error) {
//         throw error;
//     }
// };

// skillProviderService.updateSkillProvider = async (id, updates) => {
//     try {
//         const updateQuery = `
//             UPDATE skill_providers
//             SET ?
//             WHERE id = ?
//         `;
//         await query(updateQuery, [updates, id]);
//         return { id, ...updates };
//     } catch (error) {
//         throw error;
//     }
// };

// skillProviderService.deleteSkillProvider = async (id) => {
//     try {
//         const deleteQuery = 'DELETE FROM skill_providers WHERE id = ?';
//         await query(deleteQuery, [id]);
//         return { id };
//     } catch (error) {
//         throw error;
//     }
// };

// // Export the service object
// module.exports = skillProviderService;



// const mysql = require('mysql');
// const dotenv = require('dotenv');

// dotenv.config();

// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });

// // Helper function to execute SQL queries
// function query(sql, args) {
//     return new Promise((resolve, reject) => {
//         connection.query(sql, args, (err, rows) => {
//             if (err) return reject(err);
//             resolve(rows);
//         });
//     });
// }

// // Create SkillProviders table if it doesn't exist
// const createSkillProvidersTableQuery = `
//     CREATE TABLE IF NOT EXISTS skill_providers (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         firstName VARCHAR(255) NOT NULL,
//         lastName VARCHAR(255) NOT NULL,
//         email VARCHAR(255) NOT NULL UNIQUE,
//         phone VARCHAR(20),
//         address VARCHAR(255),
//         serviceCategory VARCHAR(255),
//         subCategory VARCHAR(255),
//         openingHour VARCHAR(255),
//         referralCode VARCHAR(255),
//         userId INT NOT NULL,
//         FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updatedAt TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
//     )
// `;

// connection.query(createSkillProvidersTableQuery, (err, result) => {
//     if (err) {
//         console.error('Error creating skill_providers table:', err);
//         return;
//     }
//     console.log('SkillProviders table created successfully');
// });

// // CRUD operations for SkillProviders
// exports.createSkillProvider = async (skillProviderData) => {
//     try {
//         const { firstName, lastName, email, phone, address, serviceCategory, subCategory, openingHour, referralCode, userId } = skillProviderData;
//         const insertQuery = `
//             INSERT INTO skill_providers (firstName, lastName, email, phone, address, serviceCategory, subCategory, openingHour, referralCode, userId)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//         const result = await query(insertQuery, [firstName, lastName, email, phone, address, serviceCategory, subCategory, openingHour, referralCode, userId]);
//         return { id: result.insertId, ...skillProviderData };
//     } catch (error) {
//         throw error;
//     }
// };

// exports.getSkillProviderById = async (id) => {
//     try {
//         const selectQuery = 'SELECT * FROM skill_providers WHERE id = ?';
//         const skillProviders = await query(selectQuery, [id]);
//         return skillProviders[0];
//     } catch (error) {
//         throw error;
//     }
// };

// exports.updateSkillProvider = async (id, updates) => {
//     try {
//         const updateQuery = `
//             UPDATE skill_providers
//             SET ?
//             WHERE id = ?
//         `;
//         await query(updateQuery, [updates, id]);
//         return { id, ...updates };
//     } catch (error) {
//         throw error;
//     }
// };

// exports.deleteSkillProvider = async (id) => {
//     try {
//         const deleteQuery = 'DELETE FROM skill_providers WHERE id = ?';
//         await query(deleteQuery, [id]);
//         return { id };
//     } catch (error) {
//         throw error;
//     }
// };

// // Export the connection for external use if needed
// module.exports = connection;
