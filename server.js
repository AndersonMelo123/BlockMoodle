const next = require('next');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
//var router = express.Router();
//var upload = require('./utils/multer.config.js');
//require('./routes/file.router.js')(router, upload);

const routes = {
  auth: require('./routes/auth')
}

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

//server.use(express.static('resources')); // <<<<<<===============================


app.prepare().then(() => {
  const server = express()

  server.use(session({
    secret: 'nextjs-express-mysql-starter',
    resave: false,
    cookie: { maxAge: 8*60*60*1000 },  // 8 hours
    saveUninitialized: false
  }));

  // enable files upload
  server.use(fileUpload({
    createParentPath: true
  }));

  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(bodyParser.json());

  server.use('/static', express.static('public'));

  server.use('/fonts/ionicons', express.static('./node_modules/ionicons/dist/fonts'));

  routes.auth(server);

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
.catch(err => {
  console.log('An error occurred, unable to start the server')
  console.log(err)
})

process.on('uncaughtException', function (err) {
  console.error('Uncaught Exception: ', err)
})

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection: Promise:', p, 'Reason:', reason)
})