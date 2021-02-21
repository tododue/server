import {ExpressWithAsync} from "@awaitjs/express";
import {Log} from "../../log";

export class DefaultRoute {

    static route(server: ExpressWithAsync) {

        // 5xx Route - Happens when a request errors
        server.use((err, req, res, next) => {
            Log.error(`EXPRESS`, `Error while processing ${req.path}`);
            console.error(err.stack);
            res.status(500).send("<pre>Error 500: Internal Server Error</pre>");
        });

        // 404 Route - Happens when client requests for something that doesn't exist
        server.get('*', (req, res) => {
            res.status(404).send("<pre>Error 404: Not Found</pre>");
            // sendFile(config.root + '/public/404.html')
        });

    }


}
