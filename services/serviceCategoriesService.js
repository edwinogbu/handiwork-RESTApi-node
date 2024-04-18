const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createPool({
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

// Create ServiceCategories table if it doesn't exist
async function createServiceCategoriesTable() {
    const createServiceCategoriesTableQuery = `
        CREATE TABLE IF NOT EXISTS service_categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            serviceType VARCHAR(255) NOT NULL,
            subCategory VARCHAR(255) NOT NULL,
            UNIQUE KEY(serviceType, subCategory)
        );
    `;
    try {
        await query(createServiceCategoriesTableQuery);
        console.log('ServiceCategories table created successfully');
    } catch (error) {
        console.error('Error creating ServiceCategories table:', error);
        throw error;
    }
}


// createServiceCategoriesTable();

const serviceCategoriesService = {};

serviceCategoriesService.createServiceCategory = async (serviceType, subCategory) => {
    try {
        const insertCategoryQuery = 'INSERT INTO service_categories (serviceType, subCategory) VALUES (?, ?)';
        const insertCategoryResult = await query(insertCategoryQuery, [serviceType, subCategory]);
        return insertCategoryResult.insertId;
    } catch (error) {
        throw error;
    }
};

serviceCategoriesService.getServiceCategoryId = async (serviceType, subCategory) => {
    try {
        const categoryQuery = 'SELECT id FROM service_categories WHERE serviceType = ? AND subCategory = ?';
        const categoryResult = await query(categoryQuery, [serviceType, subCategory]);
        if (categoryResult.length > 0) {
            return categoryResult[0].id;
        } else {
            throw new Error('Service category not found');
        }
    } catch (error) {
        throw error;
    }
};

serviceCategoriesService.getAllServiceCategories = async () => {
    try {
        const selectAllQuery = 'SELECT * FROM service_categories';
        const serviceCategories = await query(selectAllQuery);
        return serviceCategories;
    } catch (error) {
        throw error;
    }
};

serviceCategoriesService.updateServiceCategory = async (categoryId, newServiceType, newSubCategory) => {
    try {
        const updateCategoryQuery = 'UPDATE service_categories SET serviceType = ?, subCategory = ? WHERE id = ?';
        await query(updateCategoryQuery, [newServiceType, newSubCategory, categoryId]);
        return categoryId;
    } catch (error) {
        throw error;
    }
};

serviceCategoriesService.deleteServiceCategory = async (categoryId) => {
    try {
        const deleteCategoryQuery = 'DELETE FROM service_categories WHERE id = ?';
        await query(deleteCategoryQuery, [categoryId]);
        return categoryId;
    } catch (error) {
        throw error;
    }
};

module.exports = serviceCategoriesService;


// const mysql = require('mysql');
// const dotenv = require('dotenv');

// dotenv.config();

// const connection = mysql.createPool({
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

// const serviceCategoriesService = {};

// // Create ServiceCategories table if it doesn't exist
// async function createServiceCategoriesTable() {
//     const createServiceCategoriesTableQuery = `
//         CREATE TABLE IF NOT EXISTS service_categories (
//             id INT AUTO_INCREMENT PRIMARY KEY,
//             serviceType VARCHAR(255) NOT NULL,
//             subCategory VARCHAR(255) NOT NULL,
//             UNIQUE KEY(serviceType, subCategory)
//         );
//     `;
//     try {
//         await query(createServiceCategoriesTableQuery);
//         console.log('ServiceCategories table created successfully');
//     } catch (error) {
//         console.error('Error creating ServiceCategories table:', error);
//         throw error;
//     }
// }

// serviceCategoriesService.createServiceCategory = async (serviceType, subCategory) => {
//     try {
//         const insertCategoryQuery = 'INSERT INTO service_categories (serviceType, subCategory) VALUES (?, ?)';
//         const insertCategoryResult = await query(insertCategoryQuery, [serviceType, subCategory]);
//         return insertCategoryResult.insertId;
//     } catch (error) {
//         throw error;
//     }
// };

// serviceCategoriesService.getServiceCategoryById = async (categoryId) => {
//     try {
//         const selectQuery = 'SELECT * FROM service_categories WHERE id = ?';
//         const category = await query(selectQuery, [categoryId]);
//         return category[0];
//     } catch (error) {
//         throw error;
//     }
// };

// serviceCategoriesService.getAllServiceCategories = async () => {
//     try {
//         const selectAllQuery = 'SELECT * FROM service_categories';
//         const serviceCategories = await query(selectAllQuery);
//         return serviceCategories;
//     } catch (error) {
//         throw error;
//     }
// };

// serviceCategoriesService.updateServiceCategory = async (categoryId, newServiceType, newSubCategory) => {
//     try {
//         const updateQuery = 'UPDATE service_categories SET serviceType = ?, subCategory = ? WHERE id = ?';
//         await query(updateQuery, [newServiceType, newSubCategory, categoryId]);
//         return { id: categoryId, serviceType: newServiceType, subCategory: newSubCategory };
//     } catch (error) {
//         throw error;
//     }
// };

// serviceCategoriesService.deleteServiceCategory = async (categoryId) => {
//     try {
//         const deleteQuery = 'DELETE FROM service_categories WHERE id = ?';
//         await query(deleteQuery, [categoryId]);
//         return { id: categoryId };
//     } catch (error) {
//         throw error;
//     }
// };

// module.exports = { serviceCategoriesService, createServiceCategoriesTable };


// const mysql = require('mysql');
// const dotenv = require('dotenv');

// dotenv.config();

// const connection = mysql.createPool({
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

// const serviceCategoriesService = {};

// // Create ServiceCategories table if it doesn't exist
// async function createServiceCategoriesTable() {
//     const createServiceCategoriesTableQuery = `
//         CREATE TABLE IF NOT EXISTS service_categories (
//             id INT AUTO_INCREMENT PRIMARY KEY,
//             serviceType VARCHAR(255) NOT NULL,
//             subCategory VARCHAR(255) NOT NULL,
//             UNIQUE KEY(serviceType, subCategory)
//         );
//     `;
//     try {
//         await query(createServiceCategoriesTableQuery);
//         console.log('ServiceCategories table created successfully');
//     } catch (error) {
//         console.error('Error creating ServiceCategories table:', error);
//         throw error;
//     }
// }

// serviceCategoriesService.createServiceCategory = async (serviceType, subCategory) => {
//     try {
//         const insertCategoryQuery = 'INSERT INTO service_categories (serviceType, subCategory) VALUES (?, ?)';
//         const insertCategoryResult = await query(insertCategoryQuery, [serviceType, subCategory]);
//         return insertCategoryResult.insertId;
//     } catch (error) {
//         throw error;
//     }
// };

// serviceCategoriesService.getServiceCategoryId = async (serviceType, subCategory) => {
//     try {
//         const categoryQuery = 'SELECT id FROM service_categories WHERE serviceType = ? AND subCategory = ?';
//         const categoryResult = await query(categoryQuery, [serviceType, subCategory]);
//         if (categoryResult.length > 0) {
//             return categoryResult[0].id;
//         } else {
//             throw new Error('Service category not found');
//         }
//     } catch (error) {
//         throw error;
//     }
// };

// serviceCategoriesService.getAllServiceCategories = async () => {
//     try {
//         const selectAllQuery = 'SELECT * FROM service_categories';
//         const serviceCategories = await query(selectAllQuery);
//         return serviceCategories;
//     } catch (error) {
//         throw error;
//     }
// };

// module.exports = { serviceCategoriesService, createServiceCategoriesTable };
