const authUserService = require('../services/authUserService');

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const { token, user } = await authUserService.login(email, password);
        res.status(200).json({ success: true, token, user });
    } catch (error) {
        res.status(401).json({ success: false, error: error.message });
    }
}

module.exports = {
    login
};
