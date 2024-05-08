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
            isVerified BOOLEAN DEFAULT FALSE,
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


// verifySkillProviderService.checkVerificationStatus = async (id) => {
//     try {
//         // Retrieve detailed information about the verified skill provider
//         const skillProviderDetails = await verifySkillProviderService.getVerifySkillProviderDetailsById(id);
        
//         // Check if any field is null or empty
//         const isAnyFieldEmpty = Object.values(skillProviderDetails).some(value => value === null || value === '');

//         // Update the verification status based on the check
//         const isVerified = !isAnyFieldEmpty;

//         // Update the isVerified status in the verify_skill_providers table
//         const updateQuery = `
//             UPDATE verify_skill_providers 
//             SET isVerified=?
//             WHERE providerId=?
//         `;
//         await query(updateQuery, [isVerified, id]);

//         return isVerified;
//     } catch (error) {
//         throw error;
//     }
// };



verifySkillProviderService.checkVerificationStatus = async (id) => {
    try {
        // Retrieve detailed information about the verified skill provider
        const skillProviderDetails = await verifySkillProviderService.getVerifySkillProviderDetailsById(id);
        
        // Check if any field is null or empty
        const emptyFields = [];
        const isAnyFieldEmpty = Object.entries(skillProviderDetails).some(([key, value]) => {
            if (value === null || value === '') {
                emptyFields.push(key);
                return true;
            }
            return false;
        });

        // Update the verification status based on the check
        const isVerified = !isAnyFieldEmpty;

        // Update the isVerified status in the verify_skill_providers table
        const updateQuery = `
            UPDATE verify_skill_providers 
            SET isVerified=?
            WHERE providerId=?
        `;
        await query(updateQuery, [isVerified, id]);

        // Return the appropriate message based on the isVerified status
        if (isVerified) {
            return { isVerified: true, message: 'The provider is verified and all documents submitted.' };
        } else {
            return { isVerified: false, message: `The status is not verified because of the following missing credentials: ${emptyFields.join(', ')}` };
        }
    } catch (error) {
        throw error;
    }
};


verifySkillProviderService.updateCACImage = async (id, cacImageFilePath) => {
    try {
        // Update the CAC image path for the specified provider ID
        const updateQuery = `
            UPDATE verify_skill_providers 
            SET cacImagePath=?
            WHERE providerId=?
        `;
        await query(updateQuery, [cacImageFilePath, id]);

        // Return a success message
        return { success: true, message: 'CAC image uploaded successfully.' };
    } catch (error) {
        throw error;
    }
};


const fs = require('fs');

verifySkillProviderService.uploadCACImage = async (id, cacImageFilePath) => {
    try {
        // Read the CAC image file
        const cacImageFile = fs.readFileSync(cacImageFilePath);

        // Define the destination path to save the CAC image file
        const destinationPath = `uploads/${id}-cac-image.jpg`; // You can adjust the file name and extension as needed

        // Write the CAC image file to the destination path
        fs.writeFileSync(destinationPath, cacImageFile);

        // Insert a new record for the CAC image path into the database
        const insertQuery = `
            INSERT INTO verify_skill_providers (cacImagePath, providerId)
            VALUES (?, ?)
        `;
        await query(insertQuery, [destinationPath, id]);

        // Return a success message with the file path
        return { success: true, message: 'CAC image uploaded successfully.', imagePath: destinationPath };
    } catch (error) {
        throw error;
    }
};

verifySkillProviderService.uploadCACImage = async (id, cacImageFilePath) => {
    try {
        // Save the uploaded file path to the database
        const updateQuery = `
            UPDATE verify_skill_providers 
            SET cacImagePath=?
            WHERE providerId=?
        `;
        await query(updateQuery, [cacImageFilePath, id]);

        // Return a success message
        return { success: true, message: 'CAC image uploaded successfully.' };
    } catch (error) {
        throw error;
    }
};


verifySkillProviderService.viewCACById = async (id) => {
    try {
        const selectQuery = `
            SELECT cacImagePath
            FROM verify_skill_providers 
            WHERE providerId=?
        `;
        const result = await query(selectQuery, [id]);
        return result[0];
    } catch (error) {
        throw error;
    }
};

verifySkillProviderService.updateCACImage = async (id, cacImageFilePath) => {
    try {
        // Update the CAC image path for the specified provider ID
        const updateQuery = `
            UPDATE verify_skill_providers 
            SET cacImagePath=?
            WHERE providerId=?
        `;
        await query(updateQuery, [cacImageFilePath, id]);

        // Return a success message
        return { success: true, message: 'CAC image updated successfully.' };
    } catch (error) {
        throw error;
    }
};

verifySkillProviderService.viewAllCAC = async () => {
    try {
        const selectQuery = `
            SELECT providerId, cacImagePath
            FROM verify_skill_providers
        `;
        const result = await query(selectQuery);
        return result;
    } catch (error) {
        throw error;
    }
};


verifySkillProviderService.deleteCAC = async (id) => {
    try {
        const deleteQuery = `
            UPDATE verify_skill_providers 
            SET cacImagePath = NULL
            WHERE providerId=?
        `;
        await query(deleteQuery, [id]);
        return { success: true, message: 'CAC image deleted successfully.' };
    } catch (error) {
        throw error;
    }
};

// Function to create a new entry in verify_skill_providers table with CAC image file
verifySkillProviderService.createSkillProviderCAC = async (cacImageFile) => {
    try {
        // Upload the CAC image and get the file path
        const { filePath } = await verifySkillProviderService.uploadCACImage(cacImageFile);

        // Insert verifySkillProvider data with CAC image path into the verify_skill_providers table
        const insertQuery = `
            INSERT INTO verify_skill_providers (cacImagePath)
            VALUES (?)
        `;
        const result = await query(insertQuery, [filePath]);

        return { id: result.insertId, cacImagePath: filePath };
    } catch (error) {
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
