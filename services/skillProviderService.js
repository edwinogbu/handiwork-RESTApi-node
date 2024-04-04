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
            secondPhone VARCHAR(20),
            stateOfResidence VARCHAR(255) NOT NULL,
            city VARCHAR(255) NOT NULL,
            street VARCHAR(255) NOT NULL,
            address VARCHAR(255),
            serviceType VARCHAR(255),
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

skillProviderService.createSkillProvider = async (skillProviderData) => {
    try {
        const { firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode, imagePath } = skillProviderData;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Construct full address
        const address = `${street}, ${city}, ${stateOfResidence}`; // Correct order for address components

        // Create new user
        const newUserQuery = 'INSERT INTO users (username, email, phone,  password, role, userType) VALUES (?, ?, ?, ?, ?, ?)';
        const newUserResult = await query(newUserQuery, [`${firstName} ${lastName}`, email, phone,  hashedPassword, 'user', 'SkillProvider']);

        // Generate JWT token
        const token = signToken(newUserResult.insertId);

        // Insert skillProvider data into the skill_providers table
        const insertQuery = `
            INSERT INTO skill_providers (firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, address, serviceType, subCategory, openingHour, referralCode, imagePath, userId)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, secondPhone, stateOfResidence, city, street, address, serviceType, subCategory, openingHour, referralCode, imagePath, newUserResult.insertId]);

        return { id: result.insertId, token, ...skillProviderData, address, imagePath };
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

skillProviderService.updateSkillProviderProfileWithImage = async (providerId, providerData) => {
    try {
        // Retrieve current skillProvider data from the database
        const currentProvider = await skillProviderService.getSkillProviderById(providerId);
        if (!currentProvider) {
            throw new Error('Skill provider not found');
        }

        // Construct the updated address
        const updatedAddress = [
            providerData.stateOfResidence || currentProvider.stateOfResidence,
            providerData.city || currentProvider.city,
            providerData.street || currentProvider.street
        ].filter(Boolean).join(', ');

        // Prepare update query based on changed fields
        const updateFields = Object.entries(providerData).filter(([key, value]) => value !== currentProvider[key] && key !== 'imagePath');
        const updateValues = updateFields.map(([key, value]) => `${key}=?`).join(', ');
        const updateParams = updateFields.map(([key, value]) => value);

        // Add imagePath and updated address to updateParams
        updateParams.push(providerData.imagePath || currentProvider.imagePath);
        updateParams.push(updatedAddress);

        // Add providerId at the end of updateParams
        updateParams.push(providerId);

        // Update skill provider data in the database
        const updateQuery = `
            UPDATE skill_providers 
            SET ${updateValues}, imagePath=?, address=?
            WHERE id=?
        `;
        await query(updateQuery, updateParams);

        // Return updated skill provider data
        return { ...currentProvider, ...providerData, address: updatedAddress };
    } catch (error) {
        throw error;
    }
};

skillProviderService.deleteSkillProvider = async (id) => {
    try {
        const deleteQuery = 'DELETE FROM skill_providers WHERE id = ?';
        await query(deleteQuery, [id]);
        return { id };
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

// // Geocode address using IP info
// async function geocodeAddress(address) {
//     try {
//         const ip = '41.63.68.0'; // Default IP for geolocation
//         const ipInfo = await getIpInfo(ip, process.env.APIIP_ACCESS_KEY);
//         const latitude = ipInfo.latitude;
//         const longitude = ipInfo.longitude;
//         return { latitude, longitude };
//     } catch (error) {
//         throw error;
//     }
// }



// async function googleGeoCodeAddress(address) {
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
//             secondPhone VARCHAR(20),
//             stateOfResidence VARCHAR(255) NOT NULL,
//             city VARCHAR(255) NOT NULL,
//             street VARCHAR(255) NOT NULL,
//             address VARCHAR(255),
//             serviceType VARCHAR(255),
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




// // skillProviderService.createSkillProvider = async (skillProviderData) => {
// //     try {
// //         const { firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode, imagePath } = skillProviderData;

// //         // Hash the password
// //         const hashedPassword = await bcrypt.hash(password, 12);

// //         // Geocode the address
// //         const address = `${stateOfResidence}, ${city}, ${street}`;
// //         const { latitude, longitude } = await geocodeAddress(address);

// //         // Create new user
// //         const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
// //         const newUserResult = await query(newUserQuery, [email, email, hashedPassword, 'user', 'SkillProvider']);

// //         // Generate JWT token
// //         const token = signToken(newUserResult.insertId);

// //         // Insert skillProvider data into the skill_providers table
// //         const insertQuery = `
// //             INSERT INTO skill_providers (firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, address, serviceType, subCategory, openingHour, referralCode, userId, imagePath, latitude, longitude)
// //             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
// //         `;
// //         const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, secondPhone, stateOfResidence, city, street, address, serviceType, subCategory, openingHour, referralCode, newUserResult.insertId, imagePath, latitude, longitude]);

// //         return { id: result.insertId, token, ...skillProviderData, address, latitude, longitude };
// //     } catch (error) {
// //         throw error;
// //     }
// // };



// skillProviderService.createSkillProvider = async (skillProviderData) => {
//     try {
//         const { firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode, imagePath } = skillProviderData;

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 12);

//         // Geocode the address
//         const address = `${stateOfResidence}, ${city}, ${street}`;
//         const username = `${firstName}, ${lastName}`;
//         // const { latitude, longitude } = await geocodeAddress(address);

//         // Create new user
//         const newUserQuery = 'INSERT INTO users (username, email, phone, password, role, userType) VALUES (?, ?, ?, ?, ?)';
//         const newUserResult = await query(newUserQuery, [username, email, hashedPassword, 'user', 'SkillProvider']);

//         // Generate JWT token
//         const token = signToken(newUserResult.insertId);

//         // Insert skillProvider data into the skill_providers table
//         const insertQuery = `
//             INSERT INTO skill_providers (firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode, imagePath, userId)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//         const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode, imagePath, newUserResult.insertId]);

//         return { id: result.insertId, token, ...skillProviderData, imagePath, address };
//     } catch (error) {
//         throw error;
//     }
// };


// // skillProviderService.createSkillProvider = async (skillProviderData) => {
// //     try {
// //         const { firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode, imagePath } = skillProviderData;

// //         // Hash the password
// //         const hashedPassword = await bcrypt.hash(password, 12);

// //         // Geocode the address
// //         const address = `${stateOfResidence}, ${city}, ${street}`;
// //         const { latitude, longitude } = await geocodeAddress(address);

// //         // Create new user
// //         const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
// //         const newUserResult = await query(newUserQuery, [email, email, hashedPassword, 'user', 'SkillProvider']);

// //         // Generate JWT token
// //         const token = signToken(newUserResult.insertId);

// //         // Insert skillProvider data into the skill_providers table
// //         const insertQuery = `
// //             INSERT INTO skill_providers (firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, address, serviceType, subCategory, openingHour, referralCode, imagePath, userId, latitude, longitude)
// //             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
// //         `;
// //         const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, secondPhone, stateOfResidence, city, street, address, serviceType, subCategory, openingHour, referralCode, imagePath, newUserResult.insertId, latitude, longitude]);

// //         return { id: result.insertId, token, ...skillProviderData, imagePath, address, latitude, longitude };
// //     } catch (error) {
// //         throw error;
// //     }
// // };



// // async function createSkillProvider(skillProviderData) {
// //     try {
// //         const { firstName, lastName, email, password, phone, secondPhone, address, serviceType, subCategory, openingHour, referralCode, imagePath } = skillProviderData;

// //         // Hash the password
// //         const hashedPassword = await bcrypt.hash(password, 12);

// //         // Geocode the address
// //         // Adjust geocoding logic if necessary
        
// //         // Create new user
// //         const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
// //         const newUserResult = await query(newUserQuery, [email, email, hashedPassword, 'user', 'SkillProvider']);

// //         // Generate JWT token
// //         const token = signToken(newUserResult.insertId);

// //         // Insert skillProvider data into the skill_providers table
// //         const insertQuery = `
// //             INSERT INTO skill_providers (firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, address, serviceType, subCategory, openingHour, referralCode, imagePath, userId, latitude, longitude)
// //             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
// //         `;
// //         const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, secondPhone, address, serviceType, subCategory, openingHour, referralCode, imagePath, newUserResult.insertId, latitude, longitude]);

// //         return { 
// //             id: result.insertId, 
// //             token, 
// //             ...skillProviderData, 
// //             imagePath, // Include imagePath in the returned object
// //             address, 
// //             latitude, 
// //             longitude 
// //         };
// //     } catch (error) {
// //         throw error;
// //     }
// // }



// // skillProviderService.createSkillProvider = async (skillProviderData) => {
// //     try {
// //         const { firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode, imagePath } = skillProviderData;

// //         // Hash the password
// //         const hashedPassword = await bcrypt.hash(password, 12);

// //         // Geocode the address
// //         const address = `${stateOfResidence}, ${city}, ${street}`;
// //         // const { latitude, longitude } = await geocodeAddress(address);
        
// //         // Create new user
// //         const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
// //         const newUserResult = await query(newUserQuery, [email, email, hashedPassword, 'user', 'SkillProvider']);

// //         // Generate JWT token
// //         const token = signToken(newUserResult.insertId);

// //         // Insert skillProvider data into the skill_providers table
// //         const insertQuery = `
// //         INSERT INTO skill_providers (firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode, imagePath, userId)
// //         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
// //     `;
    
// //     const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode, imagePath, newUserResult.insertId]);

// //         return { 
// //             id: result.insertId, 
// //             token, 
// //             ...skillProviderData, 
// //             imagePath, // Include imagePath in the returned object
// //             address, 
          
// //         };
// //     } catch (error) {
// //         throw error;
// //     }
// // }

// // skillProviderService.createSkillProvider = async (skillProviderData) => {
// //     try {
// //         const { firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode, imagePath } = skillProviderData;

// //         // Hash the password
// //         const hashedPassword = await bcrypt.hash(password, 12);

// //         // Create new user
// //         const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
// //         const newUserResult = await query(newUserQuery, [email, email, hashedPassword, 'user', 'SkillProvider']);

// //         // Generate JWT token
// //         const token = signToken(newUserResult.insertId);

// //         // Insert skillProvider data into the skill_providers table
// //         const insertQuery = `
// //             INSERT INTO skill_providers (firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode, imagePath, userId)
// //             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
// //         `;
// //         const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode, imagePath, newUserResult.insertId]);

// //         return { 
// //             id: result.insertId, 
// //             token, 
// //             ...skillProviderData, 
// //             imagePath, 
// //         };
// //     } catch (error) {
// //         throw error;
// //     }
// // };

// skillProviderService.updateSkillProviderProfileWithImage = async (providerId, providerData) => {
//     try {
//         // Retrieve current skillProvider data from the database
//         const currentProvider = await skillProviderService.getSkillProviderById(providerId);
//         if (!currentProvider) {
//             throw new Error('Skill provider not found');
//         }

//         // Construct the updated address
//         const updatedAddress = [
//             providerData.stateOfResidence || currentProvider.stateOfResidence,
//             providerData.city || currentProvider.city,
//             providerData.street || currentProvider.street
//         ].filter(Boolean).join(', ');

//         // Prepare update query based on changed fields
//         const updateFields = Object.entries(providerData).filter(([key, value]) => value !== currentProvider[key] && key !== 'imagePath');
//         const updateValues = updateFields.map(([key, value]) => `${key}=?`).join(', ');
//         const updateParams = updateFields.map(([key, value]) => value);

//         // Add imagePath and updated address to updateParams
//         updateParams.push(providerData.imagePath || currentProvider.imagePath);
//         updateParams.push(updatedAddress);

//         // Add providerId at the end of updateParams
//         updateParams.push(providerId);

//         // Update skill provider data in the database
//         const updateQuery = `
//             UPDATE skill_providers 
//             SET ${updateValues}, imagePath=?, address=?
//             WHERE id=?
//         `;
//         await query(updateQuery, updateParams);

//         // Return updated skill provider data
//         return { ...currentProvider, ...providerData, address: updatedAddress };
//     } catch (error) {
//         throw error;
//     }
// };


// skillProviderService.createSkillProviderWithGoogle = async (skillProviderData) => {
//     try {
//         const { firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode } = skillProviderData;

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 12);

//         // Construct full address
//         const address = `${street}, ${city}, ${stateOfResidence}`; // Correct order for address components

//         // Geocode the address using Google Maps Geocoding API
//         const { latitude, longitude } = await googleGeoCodeAddress(address);

//         // Create new user
//         const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
//         const newUserResult = await query(newUserQuery, [email, email, hashedPassword, 'user', 'SkillProvider']);

//         // Generate JWT token
//         const token = signToken(newUserResult.insertId);

//         // Insert skillProvider data into the skill_providers table
//         const insertQuery = `
//             INSERT INTO skill_providers (firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, address, serviceType, subCategory, openingHour, referralCode, userId, latitude, longitude)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//         const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, secondPhone, stateOfResidence, city, street, address, serviceType, subCategory, openingHour, referralCode, newUserResult.insertId, latitude, longitude]);

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



// // skillProviderService.updateSkillProviderProfileWithImage = async (providerId, providerData) => {
// //     try {
// //         // Retrieve current skillProvider data from the database
// //         const currentProvider = await skillProviderService.getSkillProviderById(providerId);
// //         if (!currentProvider) {
// //             throw new Error('Skill provider not found');
// //         }

// //         // Construct the updated address
// //         const updatedAddress = [
// //             providerData.stateOfResidence || currentProvider.stateOfResidence,
// //             providerData.city || currentProvider.city,
// //             providerData.street || currentProvider.street
// //         ].filter(Boolean).join(', ');

// //         // Prepare update query based on changed fields
// //         const updateFields = Object.entries(providerData).filter(([key, value]) => value !== currentProvider[key] && key !== 'imagePath');
// //         const updateValues = updateFields.map(([key, value]) => `${key}=?`).join(', ');
// //         const updateParams = updateFields.map(([key, value]) => value);

// //         // Add imagePath and updated address to updateParams
// //         updateParams.push(providerData.imagePath || currentProvider.imagePath);
// //         updateParams.push(updatedAddress);

// //         // Add providerId at the end of updateParams
// //         updateParams.push(providerId);

// //         // Update skill provider data in the database
// //         const updateQuery = `
// //             UPDATE skill_providers 
// //             SET ${updateValues}, imagePath=?, address=?
// //             WHERE id=?
// //         `;
// //         await query(updateQuery, updateParams);

// //         // Return updated skill provider data
// //         return { ...currentProvider, ...providerData, address: updatedAddress };
// //     } catch (error) {
// //         throw error;
// //     }
// // };



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
//             serviceType VARCHAR(255),
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
//         const { firstName, lastName, email, password, phone, address, serviceType, subCategory, openingHour, referralCode } = skillProviderData;

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
//             INSERT INTO skill_providers (firstName, lastName, email, password, phone, address, serviceType, subCategory, openingHour, referralCode, userId, latitude, longitude)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//         const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, address, serviceType, subCategory, openingHour, referralCode, newUserResult.insertId, latitude, longitude]);

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
//             serviceType VARCHAR(255),
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
//         const { firstName, lastName, email, password, phone, address, serviceType, subCategory, openingHour, referralCode } = skillProviderData;

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
//             INSERT INTO skill_providers (firstName, lastName, email, password, phone, address, serviceType, subCategory, openingHour, referralCode, userId, latitude, longitude)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//         const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, address, serviceType, subCategory, openingHour, referralCode, newUserResult.insertId, latitude, longitude]);

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
//         const { firstName, lastName, email, password, phone, address, serviceType, subCategory, openingHour, referralCode } = skillProviderData;

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
//             INSERT INTO skill_providers (firstName, lastName, email, password, phone, address, serviceType, subCategory, openingHour, referralCode, userId, latitude, longitude)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//         const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, address, serviceType, subCategory, openingHour, referralCode, newUserResult.insertId, latitude, longitude]);

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
//     serviceType VARCHAR(255),
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
//         const { firstName, lastName, email, password, phone, address, serviceType, subCategory, openingHour, referralCode } = skillProviderData;

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 12);

//         // Create new user
//         const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
//         const newUserResult = await query(newUserQuery, [email, email, hashedPassword, 'user', 'SkillProvider']);

//         // Generate JWT token
//         const token = signToken(newUserResult.insertId);

//         // Now that the user is created, insert skillProvider data into the skill_providers table
//         const insertQuery = `
//             INSERT INTO skill_providers (firstName, lastName, email, password, phone, address, serviceType, subCategory, openingHour, referralCode, userId)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//         const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, address, serviceType, subCategory, openingHour, referralCode, newUserResult.insertId]);

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
//     serviceType VARCHAR(255),
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
//         const { firstName, lastName, email, phone, address, serviceType, subCategory, openingHour, referralCode, userId } = skillProviderData;
//         const insertQuery = `
//             INSERT INTO skill_providers (firstName, lastName, email, phone, address, serviceType, subCategory, openingHour, referralCode, userId)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//         const result = await query(insertQuery, [firstName, lastName, email, phone, address, serviceType, subCategory, openingHour, referralCode, userId]);
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
//         serviceType VARCHAR(255),
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
//         const { firstName, lastName, email, phone, address, serviceType, subCategory, openingHour, referralCode, userId } = skillProviderData;
//         const insertQuery = `
//             INSERT INTO skill_providers (firstName, lastName, email, phone, address, serviceType, subCategory, openingHour, referralCode, userId)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//         const result = await query(insertQuery, [firstName, lastName, email, phone, address, serviceType, subCategory, openingHour, referralCode, userId]);
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
