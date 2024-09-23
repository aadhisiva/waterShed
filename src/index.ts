/**
 * Name: Aadhi siva panjagala
 * Author: aadhisivapanjagala@gmail.com
 * File: main file of project
 * created: [2023-11-04]
 * Project: waterShead
 */
import "reflect-metadata";
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import fs from "fs";
import cors from "cors";
import { AppDataSource } from './db/config';
import Logger from './loggers/winstonLogger';

//controllers
import { adminRouter, mobileRouter } from "./apiController";

// for accessing env variables
dotenv.config();


// express adding sever to app
const app = express();

// setting port num from env
const port: any = process.env.PORT || 3000;

// used for body parsers in apis
app.use(express.json({ limit: '100mb' }));

app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// cors setup for communication of sever and client
app.use(cors({
  origin: ['http://localhost:8081', "http://localhost:8080", "http://10.10.140.162", "https://spectacles.karnataka.gov.in"],
  methods: ["GET", "POST"]
}));

// Set headers for security
app.use((req, res, next) =>
  {
      res.setHeader('X-Frame-Options', 'DENY');  // Prevent clickjacking
      res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");  // Or use CSP
      res.setHeader('X-XSS-Protection', '1; mode=block');  // Basic XSS protection
      res.setHeader('X-Content-Type-Options', 'nosniff');  // Prevent MIME sniffing
      res.header("strict-transport-security", "max-age=63072000; includeSubdomains; preload");
      res.removeHeader('Server');  // Hide 'Server' header
      next();
  });

  app.disable('x-powered-by');  // Hide 'X-Powered-By' header  

// create for logs śad
app.use(morgan('common', {
  stream: fs.createWriteStream('./logs/application.log', { flags: 'a' })
}));

app.use(morgan('dev'));

// we are adding port connection here
app.get("/wapi/run", (req, res) => {
  res.send("running")
})

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}; // for creating uploads folder for file requests

// controllers
app.use('/wapi/admin', adminRouter);
app.use('/wapi/mobile', mobileRouter);

// intialize the db then build a server
AppDataSource.initialize().then(async (connection) => {
  app.listen(port, () => {
    Logger.info(`⚡️[Database]: Database connected....+++++++ ${port}`);
  });
}).catch(error => {
  Logger.error("connection error :::::::", error);
  throw new Error("new Connection ERROR " + JSON.stringify(error));
})



