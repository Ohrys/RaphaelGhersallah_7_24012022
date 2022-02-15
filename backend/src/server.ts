import "reflect-metadata";
const http = require("http");
const app = require('./app');

// normalise un port qu'il soit donné par chaîne texte ou par valeur. 
const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port))
        return val;

    if (port >= 0)
        return port;

    return false;
};
const port = normalizePort(process.env.PORT || '3000');

app.set('port', port);
const server = http.createServer(app);
server.listen(port);