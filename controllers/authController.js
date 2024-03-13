const authService = require('../services/authService');

exports.signup = async (req, res) => {
    const { username, password, email, role, userType } = req.body;
    try {
        const { token, user } = await authService.signup(username, password, email, role, userType);
        res.status(201).json({ token, user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { token, user } = await authService.login(email, password);
        res.json({ token, user });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};
