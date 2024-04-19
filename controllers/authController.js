const authenticationService = require('../services/authService');

// Function to sanitize input to prevent XSS attacks
function sanitizeInput(input) {
    if (typeof input !== 'string') {
        return '';
    }
    // Replace potentially dangerous characters with HTML entities
    return input.replace(/[&<>"'/]/g, (char) => {
        switch (char) {
            case '&':
                return '&amp;';
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '"':
                return '&quot;';
            case "'":
                return '&#x27;'; // &apos; is not recommended, use &#x27; instead
            case '/':
                return '&#x2F;'; // Forward slash is included as it could end an HTML entity
            default:
                return char;
        }
    });
}

async function authenticateUser(req, res) {
    try {
        const { emailOrPhone, password } = req.body;
        const sanitizedEmailOrPhone = sanitizeInput(emailOrPhone);
        const sanitizedPassword = sanitizeInput(password);
        const result = await authenticationService.authenticateUser({ emailOrPhone: sanitizedEmailOrPhone, password: sanitizedPassword });
        res.status(200).json({ success: true, user: result.user, token: result.token });
    } catch (error) {
        res.status(401).json({ success: false, error: error.message });
    }
}

async function registerUser(req, res) {
    try {
        const userData = req.body;
        const sanitizedUserData = {};
        for (const key in userData) {
            sanitizedUserData[key] = sanitizeInput(userData[key]);
        }
        const result = await authenticationService.registerUser(sanitizedUserData);
        res.status(201).json({ success: true, user: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

async function requestPasswordReset(req, res) {
    try {
        const { emailOrPhone } = req.body;
        const sanitizedEmailOrPhone = sanitizeInput(emailOrPhone);
        const result = await authenticationService.requestPasswordReset(sanitizedEmailOrPhone);
        res.status(200).json({ success: true, userId: result.userId, message: 'OTP sent to email' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

async function resetPassword(req, res) {
    try {
        const resetData = req.body;
        const sanitizedResetData = {};
        for (const key in resetData) {
            sanitizedResetData[key] = sanitizeInput(resetData[key]);
        }
        await authenticationService.resetPassword(sanitizedResetData);
        res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

async function verifyOTP(req, res) {
    try {
        const { userId, otp } = req.body;
        const sanitizedUserId = sanitizeInput(userId);
        const sanitizedOtp = sanitizeInput(otp);
        const otpVerificationResult = await authenticationService.verifyOTP(sanitizedUserId, sanitizedOtp);
        if (otpVerificationResult.valid) {
            res.status(200).json({ success: true, message: otpVerificationResult.message });
        } else {
            res.status(400).json({ success: false, error: otpVerificationResult.message });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

async function getAllUsers(req, res) {
    try {
        const users = await authenticationService.getAllUsers();
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {
    authenticateUser,
    registerUser,
    requestPasswordReset,
    resetPassword,
    verifyOTP,
    getAllUsers,
};




// const authenticationService = require('../services/authService');


// async function authenticateUser(req, res) {
//     try {
//         const { emailOrPhone, password } = req.body;
//         const result = await authenticationService.authenticateUser({ emailOrPhone, password });
//         res.status(200).json({ success: true, user: result.user, token: result.token });
//     } catch (error) {
//         res.status(401).json({ success: false, error: error.message });
//     }
// }

// async function registerUser(req, res) {
//     try {
//         const userData = req.body;
//         const result = await authenticationService.registerUser(userData);
//         res.status(201).json({ success: true, user: result });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// async function requestPasswordReset(req, res) {
//     try {
//         const { emailOrPhone } = req.body;
//         const result = await authenticationService.requestPasswordReset(emailOrPhone);
//         res.status(200).json({ success: true, userId: result.userId, message: 'OTP sent to email' });
//     } catch (error) {
//         res.status(400).json({ success: false, error: error.message });
//     }
// }

// async function resetPassword(req, res) {
//     try {
//         const resetData = req.body;
//         await authenticationService.resetPassword(resetData);
//         res.status(200).json({ success: true, message: 'Password reset successful' });
//     } catch (error) {
//         res.status(400).json({ success: false, error: error.message });
//     }
// }

// async function verifyOTP(req, res) {
//     try {
//         const { userId, otp } = req.body;
//         const otpVerificationResult = await authenticationService.verifyOTP(userId, otp);
//         if (otpVerificationResult.valid) {
//             res.status(200).json({ success: true, message: otpVerificationResult.message });
//         } else {
//             res.status(400).json({ success: false, error: otpVerificationResult.message });
//         }
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// async function getAllUsers(req, res) {
//     try {
//         const users = await authenticationService.getAllUsers();
//         res.status(200).json({ success: true, users });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// module.exports = {
//     authenticateUser,
//     registerUser,
//     requestPasswordReset,
//     resetPassword,
//     verifyOTP,
//     getAllUsers,
// };



// const authenticationService = require('../services/authService');

// async function authenticateUser(req, res) {
//     try {
//         const { emailOrPhone, password } = req.body;
//         const result = await authenticationService.authenticateUser({ emailOrPhone, password });
//         res.status(200).json({ success: true, user: result.user, token: result.token });
//     } catch (error) {
//         res.status(401).json({ success: false, error: error.message });
//     }
// }

// async function registerUser(req, res) {
//     try {
//         const userData = req.body;
//         const result = await authenticationService.registerUser(userData);
//         res.status(201).json({ success: true, user: result });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// async function requestPasswordReset(req, res) {
//     try {
//         const { emailOrPhone } = req.body;
//         const result = await authenticationService.requestPasswordReset(emailOrPhone);
//         res.status(200).json({ success: true, userId: result.userId, message: 'OTP sent to email' });
//     } catch (error) {
//         res.status(400).json({ success: false, error: error.message });
//     }
// }

// async function resetPassword(req, res) {
//     try {
//         const resetData = req.body;
//         await authenticationService.resetPassword(resetData);
//         res.status(200).json({ success: true, message: 'Password reset successful' });
//     } catch (error) {
//         res.status(400).json({ success: false, error: error.message });
//     }
// }

// async function verifyToken(req, res) {
//     try {
//         const token = req.headers.authorization.split(' ')[1];
//         const user = await authenticationService.verifyToken(token);
//         res.status(200).json({ success: true, user });
//     } catch (error) {
//         res.status(401).json({ success: false, error: error.message });
//     }
// }

// async function getAllUsers(req, res) {
//     try {
//         const users = await authenticationService.getAllUsers();
//         res.status(200).json({ success: true, users });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// async function verifyOTP(req, res) {
//     try {
//         const { userId, otp } = req.body;
//         await authenticationService.verifyOTP(userId, otp);
//         res.status(200).json({ success: true, message: 'OTP verified successfully' });
//     } catch (error) {
//         res.status(400).json({ success: false, error: error.message });
//     }
// }

// module.exports = {
//     authenticateUser,
//     registerUser,
//     requestPasswordReset,
//     resetPassword,
//     verifyToken,
//     getAllUsers,
//     verifyOTP,
// };



// const authenticationService = require('../services/authService');

// async function authenticateUser(req, res) {
//     try {
//         const { emailOrPhone, password } = req.body;
//         const result = await authenticationService.authenticateUser({ emailOrPhone, password });
//         res.status(200).json({ success: true, user: result.user, token: result.token });
//     } catch (error) {
//         res.status(401).json({ success: false, error: error.message });
//     }
// }

// async function registerUser(req, res) {
//     try {
//         const userData = req.body;
//         const result = await authenticationService.registerUser(userData);
//         res.status(201).json({ success: true, user: result });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// // async function requestPasswordReset(req, res) {
// //     try {
// //         const emailOrPhone = req.body.emailOrPhone;
// //         const resetToken = await authenticationService.requestPasswordReset(emailOrPhone);
// //         res.status(200).json({ success: true, resetToken });
// //     } catch (error) {
// //         res.status(400).json({ success: false, error: error.message });
// //     }
// // }


// async function requestPasswordReset(req, res) {
//     try {
//         const { emailOrPhone } = req.body;
//         const result = await authenticationService.requestPasswordReset(emailOrPhone);
//         res.status(200).json({ success: true, userId: result.userId, message: 'OTP sent to email' });
//     } catch (error) {
//         res.status(400).json({ success: false, error: error.message });
//     }
// }


// async function resetPassword(req, res) {
//     try {
//         const resetData = req.body;
//         await authenticationService.resetPassword(resetData);
//         res.status(200).json({ success: true, message: 'Password reset successful' });
//     } catch (error) {
//         res.status(400).json({ success: false, error: error.message });
//     }
// }

// async function verifyToken(req, res) {
//     try {
//         const token = req.headers.authorization.split(' ')[1];
//         const user = await authenticationService.verifyToken(token);
//         res.status(200).json({ success: true, user });
//     } catch (error) {
//         res.status(401).json({ success: false, error: error.message });
//     }
// }

// async function getAllUsers(req, res) {
//     try {
//         const users = await authenticationService.getAllUsers();
//         res.status(200).json({ success: true, users });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// module.exports = {
//     authenticateUser,
//     registerUser,
//     requestPasswordReset,
//     resetPassword,
//     verifyToken,
//     getAllUsers,
// };



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
//         const { identifier, password } = req.body;
//         const { token, user } = await authService.login(identifier, password);
//         res.json({ token, user });
//     } catch (error) {
//         res.status(401).json({ message: error.message });
//     }
// }


// async function getAllUsers(req, res) {
//     try {
//         const users = await authService.getAllUsers();
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

// module.exports = {
//     signup,
//     login,
//     getAllUsers
// };


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
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

// module.exports = {
//     signup,
//     login,
//     getAllUsers
// };


