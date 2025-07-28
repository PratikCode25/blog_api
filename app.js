const express = require('express');
require('dotenv').config();
const connectDB = require('./app/config/db');
const path=require('path');
const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


const authRoutes=require('./app/router/authRoutes');
app.use('/api/auth',authRoutes);

const userRoutes=require('./app/router/userRoutes');
app.use('/api/user',userRoutes);

const blogCategoryRoutes=require('./app/router/blogCategoryRoutes');
app.use('/api/categories',blogCategoryRoutes);

const postRoutes=require('./app/router/postRoutes');
app.use('/api/posts',postRoutes);

const port = process.env.PORT || 3005;

app.listen(port, () => { console.log(`Server is listening on port ${port}`) });