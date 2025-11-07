const express = require('express');
const mysql = require('mysql2');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());

// MySQL setup
const sqlDb = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'yourpassword',
    database: 'tasksdb'
});

sqlDb.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL!");
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});