import "reflect-metadata";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as bearerToken from "express-bearer-token";
import * as morgan from "morgan";
import * as ejs from "ejs";
import * as path from "path";
import {addAsync} from "@awaitjs/express";
import {StaticRoute} from "./routes/staticRoute";
import {Config} from "../config";
import {ApiRoute} from "./routes/apiRoute";
import {Log} from "../log";
import {DefaultRoute} from "./routes/defaultRoute";


// Create server
const server = addAsync(express());

// Express Middlewares
server.use(morgan("[MORGAN] :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms"));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));
server.use(bearerToken());

// Express variables
server.disable("x-powered-by");
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, "../views"));

// Register routes
StaticRoute.route(server);
ApiRoute.route(server);

// Register Default Route -- Must be last
DefaultRoute.route(server);

// Start server!
server.listen(Config.APP_PORT, Config.APP_ADDRESS, () => {
    Log.info('EXPRESS', `Service Online! Express listening on ${Config.APP_ADDRESS}:${Config.APP_PORT}`);
});
