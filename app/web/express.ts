import "reflect-metadata";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as bearerToken from "express-bearer-token";
import * as morgan from "morgan";
import * as ejs from "ejs";
import * as path from "ejs";
import {addAsync} from "@awaitjs/express";
import {StaticRoute} from "./routes/staticroute";


// Create server
const server = addAsync(express());

// Express Middlewares
server.use(morgan("short"));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));
server.use(bearerToken());

// Express variables
server.disable("x-powered-by");
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, "../views"));

// Register routes
StaticRoute.route(server);
