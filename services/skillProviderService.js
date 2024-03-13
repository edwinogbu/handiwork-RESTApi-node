const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

// Create SkillProviders table if it doesn't exist
const createSkillProvidersTableQuery = `
CREATE TABLE IF NOT EXISTS skill_providers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    serviceType VARCHAR(255),
    serviceTypeCategory VARCHAR(255),
    openingHour VARCHAR(255),
    referralCode VARCHAR(255),
    userId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

`;

connection.query(createSkillProvidersTableQuery, (err, result) => {
    if (err) {
        console.error('Error creating skill_providers table:', err);
        return;
    }
    console.log('SkillProviders table created successfully');
});

// Function to sign JWT token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

// CRUD operations for SkillProviders
const skillProviderService = {};

skillProviderService.createSkillProvider = async (skillProviderData) => {
    try {
        const { firstName, lastName, email, password, phone, address, serviceType, serviceTypeCategory, openingHour, referralCode } = skillProviderData;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
        const newUserResult = await query(newUserQuery, [email, email, hashedPassword, 'user', 'SkillProvider']);

        // Generate JWT token
        const token = signToken(newUserResult.insertId);

        // Now that the user is created, insert skillProvider data into the skill_providers table
        const insertQuery = `
            INSERT INTO skill_providers (firstName, lastName, email, password, phone, address, serviceType, serviceTypeCategory, openingHour, referralCode, userId)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, address, serviceType, serviceTypeCategory, openingHour, referralCode, newUserResult.insertId]);

        // Return the newly created skillProvider data along with the user token
        return { id: result.insertId, token, ...skillProviderData };
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

skillProviderService.deleteSkillProvider = async (id) => {
    try {
        const deleteQuery = 'DELETE FROM skill_providers WHERE id = ?';
        await query(deleteQuery, [id]);
        return { id };
    } catch (error) {
        throw error;
    }
};

// Export the service object
module.exports = skillProviderService;


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
//     serviceTypeCategory VARCHAR(255),
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
//         const { firstName, lastName, email, phone, address, serviceType, serviceTypeCategory, openingHour, referralCode, userId } = skillProviderData;
//         const insertQuery = `
//             INSERT INTO skill_providers (firstName, lastName, email, phone, address, serviceType, serviceTypeCategory, openingHour, referralCode, userId)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//         const result = await query(insertQuery, [firstName, lastName, email, phone, address, serviceType, serviceTypeCategory, openingHour, referralCode, userId]);
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
//         serviceTypeCategory VARCHAR(255),
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
//         const { firstName, lastName, email, phone, address, serviceType, serviceTypeCategory, openingHour, referralCode, userId } = skillProviderData;
//         const insertQuery = `
//             INSERT INTO skill_providers (firstName, lastName, email, phone, address, serviceType, serviceTypeCategory, openingHour, referralCode, userId)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//         const result = await query(insertQuery, [firstName, lastName, email, phone, address, serviceType, serviceTypeCategory, openingHour, referralCode, userId]);
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
