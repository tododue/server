import {ExpressWithAsync} from "@awaitjs/express";
import * as express from "express";
import * as path from "path";
import {Config} from "../../config";

export class StaticRoute {

    // Application route for static services such as the main page and public assets
    static route(server: ExpressWithAsync) {

        // All static content served from index.html
        server.use(express.static(path.join(Config.ROOT, "/public")));

        // Send the index.html if they request for /
        server.get("/", (req, res) => {
           res.sendFile(path.join(Config.ROOT, "/public/index.html"));
        });

    }

}
