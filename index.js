/* Global imports */
const os = require('os');
const fs = require('fs');
const cluster = require('cluster');
const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const { createServer } = require('http');
const { EventEmitter } = require('events');

/* Local imports */
const { ENV } = require('./src/config/env');
const { connectDB } = require('./src/config/db');
const apiRoutes = require('./src/routes');
const {
  STATUSCODE,
  successResponse,
  clientErrorResponse,
} = require('./src/utils/response');

const app = express();
const server = createServer(app);
const port = ENV.PORT;
const totalCPU = os.cpus().length;
const emmiter = new EventEmitter();
emmiter.setMaxListeners(100);

const limiter = rateLimit({
  windowMs: 5000, // 5 second
  max: 30, // Limit each IP to 30 requests per `window` (here, per 5 second)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/* Set trust proxy */
app.set('trust proxy', '127.0.0.1');

/* Middlewares */
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cors());
app.use(limiter);
app.use(helmet.hidePoweredBy());
app.use(hpp());

/* Root API */
app.get('/', (req, res) =>
  successResponse(req, res, 'Welcome to instructor attendance service API')
);

/* API routes */
app.use(apiRoutes);

/* Not found API */
app.use('*', (req, res) =>
  clientErrorResponse(res, 'Not Found', STATUSCODE.NOTFOUND)
);

/* Create necessary folder automatically */
(() => {
  if (!fs.existsSync('logs')) fs.mkdirSync('logs');
})();

/* Server listen */
(async () => {
  const conn = await connectDB();
  if (conn) {
    if (cluster.isPrimary) {
      console.log(
        `[ Master ] - Server running | ${ENV.NODE_ENV} | port(${port}) | Database connected | pid(${process.pid})`
      );
      for (let i = 0; i < totalCPU; i++) {
        cluster.fork();
      }
      cluster.on('exit', () => {
        cluster.fork();
      });
    } else {
      server.listen(port, () =>
        console.log(
          `[ Worker ] - Server running | ${ENV.NODE_ENV} | port(${port}) | Database connected | pid(${process.pid})`
        )
      );
    }
  } else {
    console.log(`Database not connect`);
  }
})();
