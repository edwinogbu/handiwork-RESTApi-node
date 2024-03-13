const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
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
app.use('/api/auth/users', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/skill-providers', skillProviderRoutes);


// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the API server');
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// const express = require('express');
// const cors = require('cors');
// const authRoutes = require('./routes/authRoutes');
// // const userRoutes = require('./routes/userRoutes');
// const customerRoutes = require('./routes/customerRoutes');
// const skilledProviderRoutes = require('./routes/skilledProviderRoutes');

// const app = express();

// // Enable CORS
// app.use(cors());

// // Parse incoming JSON data
// app.use(express.json());

// // Define routes
// app.use('/api/auth/users', authRoutes);
// // app.use('/api/users', userRoutes);
// app.use('/api/customers', customerRoutes);
// app.use('/api/skill-providers', skilledProviderRoutes);

// // Define port
// const PORT = process.env.PORT || 3000;

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
