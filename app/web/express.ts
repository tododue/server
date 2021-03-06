import "reflect-metadata";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as bearerToken from "express-bearer-token";
import * as morgan from "morgan";
import * as ejs from "ejs";
import * as path from "path";
import * as cookieParser from "cookie-parser";
import {addAsync} from "@awaitjs/express";
import {StaticRoute} from "./routes/staticRoute";
import {Config} from "../config";
import {ApiRouteManager} from "./routes/api/apiRouteManager";
import {Log} from "../log";
import {DefaultRoute} from "./routes/defaultRoute";
import {ApiAdminRoute} from "./routes/api/apiAdminRoute";
import {ApiAssignmentRoute} from "./routes/api/apiAssignmentRoute";
import {ApiClassRoute} from "./routes/api/apiClassRoute";
import {ApiUserRoute} from "./routes/api/apiUserRoute";
import {SessionRoute} from "./routes/sessionRoute";
import {HubRoute} from "./routes/hubRoute";


// Create server
const server = addAsync(express());

// Express Middlewares
server.use(morgan("[MORGAN] :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms"));
server.use(bodyParser.json({limit: "5mb"}));
server.use(bodyParser.urlencoded({limit: "5mb", extended: true}));
server.use(cookieParser());
server.use(bearerToken());

// Express variables
server.disable("x-powered-by");
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, "../views"));
server.use((req, res, next) => {
    res.header("Cache-Control", 'no-cache');
    next();
});

// Register routes
StaticRoute.route(server);
SessionRoute.route(server);

ApiRouteManager.route(server);
ApiAdminRoute.route(server);
ApiAssignmentRoute.route(server);
ApiClassRoute.route(server);
ApiUserRoute.route(server);

HubRoute.route(server);

// Register Default Route -- Must be last
DefaultRoute.route(server);

// Start server!
server.listen(Config.APP_PORT, Config.APP_ADDRESS, () => {
    Log.info('EXPRESS', `Service Online! Express listening on ${Config.APP_ADDRESS}:${Config.APP_PORT}`);
});
