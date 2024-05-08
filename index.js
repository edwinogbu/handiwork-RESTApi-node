const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // Import the 'path' module

const authRoutes = require('./routes/authRoutes');
const verifySkillProviderRoutes = require('./routes/verifySkillProviderRoutes');
const customerRoutes = require('./routes/customerRoutes');
const skillProviderRoutes = require('./routes/skilledProviderRoutes');
const skillProviderTypesRoutes = require('./routes/skillProviderTypesRoutes');
const nigerianStatesRoutes = require('./routes/nigerianStatesRoutes');
// const conversationRoutes = require('./routes/conversationRoutes');
const chattingRoutes = require('./routes/chattingRoutes');

const mysql = require('mysql');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

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

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register Swagger UI for each route
app.use('/api-docs/auth', swaggerUi.serve, swaggerUi.setup(authRoutes.swaggerDocument));
app.use('/api-docs/verify-providers', swaggerUi.serve, swaggerUi.setup(verifySkillProviderRoutes.swaggerDocument));
app.use('/api-docs/customers', swaggerUi.serve, swaggerUi.setup(customerRoutes.swaggerDocument));
app.use('/api-docs/skill-providers', swaggerUi.serve, swaggerUi.setup(skillProviderRoutes.swaggerDocument));
app.use('/api-docs/skills-subcategory', swaggerUi.serve, swaggerUi.setup(skillProviderTypesRoutes.swaggerDocument));
app.use('/api-docs/nigerian-states', swaggerUi.serve, swaggerUi.setup(nigerianStatesRoutes.swaggerDocument));
// app.use('/api-docs/chat', swaggerUi.serve, swaggerUi.setup(conversationRoutes.swaggerDocument));
app.use('/api-docs/chatting', swaggerUi.serve, swaggerUi.setup(chattingRoutes.swaggerDocument));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/skill-providers', skillProviderRoutes);
app.use('/api/verify-providers', verifySkillProviderRoutes);
app.use('/api/skills-subcategory', skillProviderTypesRoutes);
app.use('/api/nigerian-states', nigerianStatesRoutes);
// app.use('/api/chat', conversationRoutes);
app.use('/api/chatting', chattingRoutes);


app.use('/api-docs/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Start server
// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the API server');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');

// const authRoutes = require('./routes/authRoutes');
// const verifySkillProviderRoutes = require('./routes/verifySkillProviderRoutes');
// const customerRoutes = require('./routes/customerRoutes');
// const skillProviderRoutes = require('./routes/skilledProviderRoutes');
// const skillProviderTypesRoutes = require('./routes/skillProviderTypesRoutes');
// const nigerianStatesRoutes = require('./routes/nigerianStatesRoutes');
// // const conversationRoutes = require('./routes/conversationRoutes');
// const chattingRoutes = require('./routes/chattingRoutes');

// const mysql = require('mysql');
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger-output.json');

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Database connection
// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

// connection.connect((err) => {
//     if (err) {
//         console.error('Error connecting to database:', err);
//         return;
//     }
//     console.log('Connected to database');
// });

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/customers', customerRoutes);
// app.use('/api/skill-providers', skillProviderRoutes);
// app.use('/api/verify-providers', verifySkillProviderRoutes);
// app.use('/api/skills-subcategory', skillProviderTypesRoutes);
// app.use('/api/nigerian-states', nigerianStatesRoutes);
// // app.use('/api/chat', conversationRoutes);
// app.use('/api/chatting', chattingRoutes);


// // Default route
// app.get('/', (req, res) => {
//     res.send('Welcome to the API server');
// });

// app.use('/api-docs/api/auth', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// // Start server
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const path = require('path');

// const authRoutes = require('./routes/authRoutes');
// const verifySkillProviderRoutes = require('./routes/verifySkillProviderRoutes');
// const customerRoutes = require('./routes/customerRoutes');
// const skillProviderRoutes = require('./routes/skilledProviderRoutes');
// const skillProviderTypesRoutes = require('./routes/skillProviderTypesRoutes');
// const nigerianStatesRoutes = require('./routes/nigerianStatesRoutes');

// const mysql = require('mysql');
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger-output.json');

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Serve static files from the 'uploads' directory
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Database connection
// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

// connection.connect((err) => {
//     if (err) {
//         console.error('Error connecting to database:', err);
//         return;
//     }
//     console.log('Connected to database');
// });

// // Register Swagger UI for each route
// app.use('/api-docs/auth', swaggerUi.serve, swaggerUi.setup(authRoutes.swaggerDocument));
// app.use('/api-docs/verify-providers', swaggerUi.serve, swaggerUi.setup(verifySkillProviderRoutes.swaggerDocument));
// app.use('/api-docs/customers', swaggerUi.serve, swaggerUi.setup(customerRoutes.swaggerDocument));
// app.use('/api-docs/skill-providers', swaggerUi.serve, swaggerUi.setup(skillProviderRoutes.swaggerDocument));
// app.use('/api-docs/skills', swaggerUi.serve, swaggerUi.setup(skillProviderTypesRoutes.swaggerDocument));
// app.use('/api-docs/nigerian-states', swaggerUi.serve, swaggerUi.setup(nigerianStatesRoutes.swaggerDocument));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/customers', customerRoutes);
// app.use('/api/skill-providers', skillProviderRoutes);
// app.use('/api/verify-providers', verifySkillProviderRoutes);
// app.use('/api/skills', skillProviderTypesRoutes);
// app.use('/api/nigerian-states', nigerianStatesRoutes);

// // Default route
// app.get('/', (req, res) => {
//     res.send('Welcome to the API server.... Your One and Only Engr Eddy on Board');
// });

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
