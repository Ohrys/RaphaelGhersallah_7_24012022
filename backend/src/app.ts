import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";

const app = express();
/* const path = require('path'); */

createConnection()
    .then(() => console.log('Connecté à la base MySQL !'))
    .catch((error) => console.log('Connexion à MySQL échoué !!' + error.message));

app.use((req:Request, res: Response, next:Function) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

const userRoutes = require('./routes/user');
const publicationRoutes = require('./routes/publication');
const replyRoutes = require('./routes/reply');

app.use('/api/user', userRoutes);
app.use('/api/publication', publicationRoutes);
app.use('/api/reply', replyRoutes );

module.exports = app;