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

// Create VerifySkillProviders table if it doesn't exist
async function createVerifySkillProvidersTable() {
    const createVerifySkillProvidersTableQuery = `
        CREATE TABLE IF NOT EXISTS verify_skill_providers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            bio TEXT,
            profileUrl VARCHAR(255),
            socialPlatform JSON,
            socialPlatformUrl JSON,
            cacImagePath VARCHAR(255),
            providerId INT,
            followers INT,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (providerId) REFERENCES skill_providers(id) ON DELETE CASCADE
        );
    `;
    try {
        await query(createVerifySkillProvidersTableQuery);
        console.log('VerifySkillProviders table created successfully');
    } catch (error) {
        console.error('Error creating VerifySkillProviders table:', error);
        throw error;
    }
}

createVerifySkillProvidersTable(); // Immediately create the table on module load

const verifySkillProviderService = {};

verifySkillProviderService.createVerifySkillProvider = async (verifySkillProviderData) => {
    try {
        const { bio, profileUrl, socialPlatform, socialPlatformUrl, cacImagePath, providerId, followers } = verifySkillProviderData;

        // Convert arrays to JSON strings
        const socialPlatformJSON = JSON.stringify(socialPlatform);
        const socialPlatformUrlJSON = JSON.stringify(socialPlatformUrl);

        // Insert verifySkillProvider data into the verify_skill_providers table
        const insertQuery = `
            INSERT INTO verify_skill_providers (bio, profileUrl, socialPlatform, socialPlatformUrl, cacImagePath, providerId, followers)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await query(insertQuery, [bio, profileUrl, socialPlatformJSON, socialPlatformUrlJSON, cacImagePath, providerId, followers]);

        return { id: result.insertId, ...verifySkillProviderData };
    } catch (error) {
        throw error;
    }
};

verifySkillProviderService.getVerifySkillProviderById = async (id) => {
    try {
        const selectQuery = 'SELECT * FROM verify_skill_providers WHERE id = ?';
        const verifySkillProviders = await query(selectQuery, [id]);
        return verifySkillProviders[0];
    } catch (error) {
        throw error;
    }
};

verifySkillProviderService.getAllVerifySkillProviders = async () => {
    try {
        const selectAllQuery = 'SELECT * FROM verify_skill_providers';
        const verifySkillProviders = await query(selectAllQuery);
        return verifySkillProviders;
    } catch (error) {
        throw error;
    }
};

verifySkillProviderService.updateVerifySkillProvider = async (id, verifySkillProviderData) => {
    try {
        const { bio, profileUrl, socialPlatform, socialPlatformUrl, cacImagePath, providerId, followers } = verifySkillProviderData;

        // Convert arrays to JSON strings
        const socialPlatformJSON = JSON.stringify(socialPlatform);
        const socialPlatformUrlJSON = JSON.stringify(socialPlatformUrl);

        // Prepare update query based on changed fields
        const updateFields = Object.entries(verifySkillProviderData).filter(([key, value]) => key !== 'id' && value !== undefined);
        const updateValues = updateFields.map(([key, value]) => `${key}=?`).join(', ');
        const updateParams = updateFields.map(([key, value]) => value);

        // Add verifySkillProviderId at the end of updateParams
        updateParams.push(id);

        // Update verifySkillProvider data in the database
        const updateQuery = `
            UPDATE verify_skill_providers 
            SET ${updateValues}
            WHERE id=?
        `;
        await query(updateQuery, [...updateParams]);

        // Return updated verifySkillProvider data
        return { id, ...verifySkillProviderData };
    } catch (error) {
        throw error;
    }
};

verifySkillProviderService.deleteVerifySkillProvider = async (id) => {
    try {
        const deleteQuery = 'DELETE FROM verify_skill_providers WHERE id = ?';
        await query(deleteQuery, [id]);
        return { id };
    } catch (error) {
        throw error;
    }
};

verifySkillProviderService.getVerifySkillProviderDetailsById = async (id) => {
    try {
        const selectQuery = `
            SELECT sp.*, vsp.*
            FROM skill_providers sp
            INNER JOIN verify_skill_providers vsp ON sp.id = vsp.providerId
            WHERE sp.id = ?
        `;
        const skillProviderDetails = await query(selectQuery, [id]);
        return skillProviderDetails[0];
    } catch (error) {
        throw error;
    }
};

verifySkillProviderService.updateSkillProviderDetails = async (id, skillProviderData, verifySkillProviderData) => {
    try {
        // Start a transaction
        await query('START TRANSACTION');

        // Update skill provider details
        const { firstName, lastName, email, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode, imagePath } = skillProviderData;
        const skillProviderUpdateQuery = `
            UPDATE skill_providers 
            SET firstName=?, lastName=?, email=?, phone=?, secondPhone=?, stateOfResidence=?, city=?, street=?, serviceType=?, subCategory=?, openingHour=?, referralCode=?, imagePath=?
            WHERE id=?
        `;
        await query(skillProviderUpdateQuery, [firstName, lastName, email, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode, imagePath, id]);

        // Update verify skill provider details
        const { bio, profileUrl, socialPlatform, socialPlatformUrl, cacImagePath, followers } = verifySkillProviderData;

        // Convert arrays to JSON strings
        const socialPlatformJSON = JSON.stringify(socialPlatform);
        const socialPlatformUrlJSON = JSON.stringify(socialPlatformUrl);

        const verifySkillProviderUpdateQuery = `
            UPDATE verify_skill_providers 
            SET bio=?, profileUrl=?, socialPlatform=?, socialPlatformUrl=?, cacImagePath=?, followers=?
            WHERE providerId=?
        `;
        await query(verifySkillProviderUpdateQuery, [bio, profileUrl, socialPlatformJSON, socialPlatformUrlJSON, cacImagePath, followers, id]);

        // Commit the transaction
        await query('COMMIT');

        // Return updated skill provider details
        const updatedSkillProvider = await verifySkillProviderService.getVerifySkillProviderDetailsById(id);
        return updatedSkillProvider;
    } catch (error) {
        // Rollback the transaction if an error occurs
        await query('ROLLBACK');
        throw error;
    }
};



module.exports = verifySkillProviderService;




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

// // Create VerifySkillProviders table if it doesn't exist
// async function createVerifySkillProvidersTable() {
//     const createVerifySkillProvidersTableQuery = `
//         CREATE TABLE IF NOT EXISTS verify_skill_providers (
//             id INT AUTO_INCREMENT PRIMARY KEY,
//             bio TEXT,
//             profileUrl VARCHAR(255),
//             socialPlatform VARCHAR(255),
//             socialPlatformUrl VARCHAR(255),
//             cacImagePath VARCHAR(255),
//             providerId INT,
//             followers INT,
//             createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             FOREIGN KEY (providerId) REFERENCES skill_providers(id) ON DELETE CASCADE
//         );
//     `;
//     try {
//         await query(createVerifySkillProvidersTableQuery);
//         console.log('VerifySkillProviders table created successfully');
//     } catch (error) {
//         console.error('Error creating VerifySkillProviders table:', error);
//         throw error;
//     }
// }

// createVerifySkillProvidersTable(); // Immediately create the table on module load

// const verifySkillProviderService = {};

// verifySkillProviderService.createVerifySkillProvider = async (verifySkillProviderData) => {
//     try {
//         const { bio, profileUrl, socialPlatform, socialPlatformUrl, cacImagePath, providerId, followers } = verifySkillProviderData;

//         // Insert verifySkillProvider data into the verify_skill_providers table
//         const insertQuery = `
//             INSERT INTO verify_skill_providers (bio, profileUrl, socialPlatform, socialPlatformUrl, cacImagePath, providerId, followers)
//             VALUES (?, ?, ?, ?, ?, ?, ?)
//         `;
//         const result = await query(insertQuery, [bio, profileUrl, socialPlatform, socialPlatformUrl, cacImagePath, providerId, followers]);

//         return { id: result.insertId, ...verifySkillProviderData };
//     } catch (error) {
//         throw error;
//     }
// };

// verifySkillProviderService.getVerifySkillProviderById = async (id) => {
//     try {
//         const selectQuery = 'SELECT * FROM verify_skill_providers WHERE id = ?';
//         const verifySkillProviders = await query(selectQuery, [id]);
//         return verifySkillProviders[0];
//     } catch (error) {
//         throw error;
//     }
// };

// verifySkillProviderService.getAllVerifySkillProviders = async () => {
//     try {
//         const selectAllQuery = 'SELECT * FROM verify_skill_providers';
//         const verifySkillProviders = await query(selectAllQuery);
//         return verifySkillProviders;
//     } catch (error) {
//         throw error;
//     }
// };

// verifySkillProviderService.updateVerifySkillProvider = async (id, verifySkillProviderData) => {
//     try {
//         const { bio, profileUrl, socialPlatform, socialPlatformUrl, cacImagePath, providerId, followers } = verifySkillProviderData;

//         // Prepare update query based on changed fields
//         const updateFields = Object.entries(verifySkillProviderData).filter(([key, value]) => key !== 'id' && value !== undefined);
//         const updateValues = updateFields.map(([key, value]) => `${key}=?`).join(', ');
//         const updateParams = updateFields.map(([key, value]) => value);

//         // Add verifySkillProviderId at the end of updateParams
//         updateParams.push(id);

//         // Update verifySkillProvider data in the database
//         const updateQuery = `
//             UPDATE verify_skill_providers 
//             SET ${updateValues}
//             WHERE id=?
//         `;
//         await query(updateQuery, updateParams);

//         // Return updated verifySkillProvider data
//         return { id, ...verifySkillProviderData };
//     } catch (error) {
//         throw error;
//     }
// };

// verifySkillProviderService.deleteVerifySkillProvider = async (id) => {
//     try {
//         const deleteQuery = 'DELETE FROM verify_skill_providers WHERE id = ?';
//         await query(deleteQuery, [id]);
//         return { id };
//     } catch (error) {
//         throw error;
//     }
// };



// verifySkillProviderService.getVerifySkillProviderDetailsById = async (id) => {
//     try {
//         const selectQuery = `
//             SELECT sp.*, vsp.*
//             FROM skill_providers sp
//             INNER JOIN verify_skill_providers vsp ON sp.id = vsp.providerId
//             WHERE sp.id = ?
//         `;
//         const skillProviderDetails = await query(selectQuery, [id]);
//         return skillProviderDetails[0];
//     } catch (error) {
//         throw error;
//     }
// };



// // verifySkillProviderService.updateSkillProviderDetails = async (id, skillProviderData, verifySkillProviderData) => {
// //     try {
// //         // Start a transaction
// //         await query('START TRANSACTION');

// //         // Update skill provider details
// //         const { firstName, lastName, email, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode, imagePath } = skillProviderData;
// //         const skillProviderUpdateQuery = `
// //             UPDATE skill_providers 
// //             SET firstName=?, lastName=?, email=?, phone=?, secondPhone=?, stateOfResidence=?, city=?, street=?, serviceType=?, subCategory=?, openingHour=?, referralCode=?, imagePath=?
// //             WHERE id=?
// //         `;
// //         await query(skillProviderUpdateQuery, [firstName, lastName, email, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode, imagePath, id]);

// //         // Update verify skill provider details
// //         const { bio, profileUrl, socialPlatform, socialPlatformUrl, cacImagePath, followers } = verifySkillProviderData;
// //         const verifySkillProviderUpdateQuery = `
// //             UPDATE verify_skill_providers 
// //             SET bio=?, profileUrl=?, socialPlatform=?, socialPlatformUrl=?, cacImagePath=?, followers=?
// //             WHERE providerId=?
// //         `;
// //         await query(verifySkillProviderUpdateQuery, [bio, profileUrl, socialPlatform, socialPlatformUrl, cacImagePath, followers, id]);

// //         // Commit the transaction
// //         await query('COMMIT');

// //         // Return updated skill provider details
// //         const updatedSkillProvider = await getSkillProviderById(id);
// //         return updatedSkillProvider;
// //     } catch (error) {
// //         // Rollback the transaction if an error occurs
// //         await query('ROLLBACK');
// //         throw error;
// //     }
// // };



// // Function to update both skill provider and verify skill provider details
// verifySkillProviderService.updateSkillProviderDetails = async (id, skillProviderData, verifySkillProviderData) => {
//     try {
//         // Start a transaction
//         await query('START TRANSACTION');

//         // Update skill provider details
//         const { firstName, lastName, email, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode, imagePath } = skillProviderData;
//         const skillProviderUpdateQuery = `
//             UPDATE skill_providers 
//             SET firstName=?, lastName=?, email=?, phone=?, secondPhone=?, stateOfResidence=?, city=?, street=?, serviceType=?, subCategory=?, openingHour=?, referralCode=?, imagePath=?
//             WHERE id=?
//         `;
//         await query(skillProviderUpdateQuery, [firstName, lastName, email, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode, imagePath, id]);

//         // Update verify skill provider details
//         const { bio, profileUrl, socialPlatform, socialPlatformUrl, cacImagePath, followers } = verifySkillProviderData;
//         const verifySkillProviderUpdateQuery = `
//             UPDATE verify_skill_providers 
//             SET bio=?, profileUrl=?, socialPlatform=?, socialPlatformUrl=?, cacImagePath=?, followers=?
//             WHERE providerId=?
//         `;
//         await query(verifySkillProviderUpdateQuery, [bio, profileUrl, socialPlatform, socialPlatformUrl, cacImagePath, followers, id]);

//         // Commit the transaction
//         await query('COMMIT');

//         // Return updated skill provider details
//         const updatedSkillProvider = await verifySkillProviderService.getVerifySkillProviderDetailsById(id);
//         return updatedSkillProvider;
//     } catch (error) {
//         // Rollback the transaction if an error occurs
//         await query('ROLLBACK');
//         throw error;
//     }
// };


// module.exports = verifySkillProviderService;
