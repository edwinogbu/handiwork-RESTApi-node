const authService = require('../services/authService');

async function signup(req, res) {
    try {
        const { username, password, email, role, userType } = req.body;
        const { token, user } = await authService.signup(username, password, email, role, userType);
        res.status(201).json({ token, user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const { token, user } = await authService.login(email, password);
        res.json({ token, user });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
}

async function getAllUsers(req, res) {
    try {
        const users = await authService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    signup,
    login,
    getAllUsers
};



// const authService = require('../services/authService');

// async function signup(req, res) {
//     try {
//         const { username, password, email, role, userType } = req.body;
//         const { token, user } = await authService.signup(username, password, email, role, userType);
//         res.status(201).json({ token, user });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// }


// async function login(req, res) {
//     try {
//         const { email, password } = req.body;
//         const { token, user } = await authService.login(email, password);
//         res.json({ token, user });
//     } catch (error) {
//         res.status(401).json({ message: error.message });
//     }
// }




// async function getAllUsers(req, res) {
//     try {
//         const users = await authService.getAllUsers();
//         res.status(200).json({ success: true, users });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// module.exports = {
//     signup,
//     login,
//     getAllUsers
// };



// const authService = require('./../services/authService');


// async function signup(req, res) {
//     try {
//         const { username, password, email, role, userType } = req.body;
//         const { token, user } = await authService.signup(username, password, email, role, userType);
//         res.status(201).json({ token, user });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// }

// async function login(req, res) {
//     try {
//         const { email, password } = req.body;
//         const { token, user } = await authService.login(email, password);
//         res.json({ token, user });
//     } catch (error) {
//         res.status(401).json({ message: error.message });
//     }
// }

// module.exports = {
//     signup,
//     login
// };



// const authService = require('../services/authService');

// exports.signup = async (req, res) => {
//     const { username, password, email, role, userType } = req.body;
//     try {
//         const { token, user } = await authService.signup(username, password, email, role, userType);
//         res.status(201).json({ token, user });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// exports.login = async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const { token, user } = await authService.login(email, password);
//         res.json({ token, user });
//     } catch (error) {
//         res.status(401).json({ message: error.message });
//     }
// };


// const authService = require('../services/authService');

// exports.signup = async (req, res) => {
//     const { username, password, email, role, userType } = req.body;
//     try {
//         const { token, user } = await authService.signup(username, password, email, role, userType);
//         res.status(201).json({ token, user });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// exports.login = async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const { token, user } = await authService.login(email, password);
//         res.json({ token, user });
//     } catch (error) {
//         res.status(401).json({ message: error.message });
//     }
// };
