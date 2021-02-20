import {ExpressWithAsync} from "@awaitjs/express";
import * as express from "express";
import * as path from "path";

export class StaticRoute {

    // Application route for static services such as the main page and public assets
    static route(server: ExpressWithAsync) {
        server.use(express.static(path.join(__dirname, "../../public")));
    }

}
