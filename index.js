const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const verifySkillProviderRoutes = require('./routes/verifySkillProviderRoutes');
const customerRoutes = require('./routes/customerRoutes');
const skillProviderRoutes = require('./routes/skilledProviderRoutes');

const mysql = require('mysql');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/skill-providers', skillProviderRoutes);
app.use('/api/verify-providers', verifySkillProviderRoutes);


// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the API server');
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
