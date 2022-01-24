const express = require('express');
const typeorm = require("typeorm");
const app = express();
/* const path = require('path'); */

typeorm.createConnection()
.then(()=>console.log('Connecté à la base MySQL !'))
.catch((error)=>console.log('Connexion à MySQL échoué !!'+error.message));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

/* app.use('/images', express.static(path.join(__dirname+'images'))); */

const userRoutes = require('./routes/user');

app.use('/api/auth', userRoutes);


module.exports = app;