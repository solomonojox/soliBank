const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose')
const cors = require('cors');
const { errorHandler } = require('./Middleware/errorMiddleware');
const { logger } = require('./Middleware/loggerMiddleware');
// const path = require('path');

const config = require('./Config/config');
console.log(`Welcome to ${config.appName} version ${config.apiVersion}`);


// Routes
const userRoutes = require('./Routes/userRoute');
const transactionRoutes = require('./Routes/transactionRoute');
const profileRoute = require('./Routes/profileRoute');

// Initialize dotenv to manage environment variables
dotenv.config();

// Create an instance of express
const app = express();

// Error handler
app.use(errorHandler);

// Middleware to parse JSON
app.use(express.json());

// Logger
app.use(logger);

// CORS
const corsOptions = {
  origin: "*",
  credentials: true,
  optionsSuccessStatus: 200
};

// Enable CORS
app.use(cors(corsOptions));
  
// Define the port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err); 
});

// Use the Routes
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/', profileRoute);
// // Serve static files from the 'uploads' directory
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
