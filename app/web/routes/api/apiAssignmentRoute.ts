import {ExpressWithAsync} from "@awaitjs/express";
import {Log} from "../../../log";

export class ApiAssignmentRoute {

    static route(server: ExpressWithAsync) {
        Log.info("EXPRESS", "Registering ApiAssignmentRoute...");

        // Upload of an assignment page by the extension
        server.postAsync("/api/upload", (req, res) => {
            let platform = req.body["platform"];
            let page = req.body["page"];

            // parser

        });
    }
}
