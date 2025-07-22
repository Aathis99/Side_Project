// backend/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors'); // เพิ่ม CORS middleware
const db = require('./config/db'); // นำเข้า pool จากไฟล์ config/db.js
const authRoutes = require('./routes/authRoutes');
const productTypeRoutes = require('./routes/productTypeRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes'); // เพิ่ม userRoutes

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors()); // อนุญาตให้ Frontend (React) เรียก API ได้

// ทดสอบการเชื่อมต่อฐานข้อมูล
db.getConnection()
    .then(connection => {
        console.log('Connected to MySQL database!');
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to database:', err);
    });

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/product-types', productTypeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes); // ใช้ userRoutes

// Route ทดสอบ
app.get('/', (req, res) => {
    res.send('API is running...');
});

// เริ่มต้น Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});