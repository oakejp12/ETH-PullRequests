import express      from 'express';
import bodyParser   from 'body-parser';
import http         from 'http';
import path         from 'path';

// Set up the Express application
const app = express();
const PORT = process.env.PORT || 5000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.get('/api/hello', (req, res) => {
    res.send({ express: 'Porting over old code!' });
});

// Static directory
//app.use(express.static(path.join(__dirname, "src")));

// require(path.join(__dirname, 'routes', 'html-routes.js'))(app);
// require(path.join(__dirname, 'routes', 'api-routes.js'))(app);

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});

const server = http.createServer(app);

server.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
