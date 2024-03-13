const UserService = require('../services/userService');

// Controller function to handle creating a new user
exports.createUser = async (req, res, next) => {
    try {
        const { username, password, email, role, userType } = req.body;
        const userData = { username, password, email, role, userType };
        const user = await UserService.createUser(userData);
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Controller function to handle getting a user by ID
exports.getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await UserService.getUserById(id);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Controller function to handle updating a user
exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedUser = await UserService.updateUser(id, updates);
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Controller function to handle deleting a user
exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        await UserService.deleteUser(id);
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
