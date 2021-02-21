import {ExpressWithAsync} from "@awaitjs/express";
import {Log} from "../../../log";
import {User} from "../../../db/orm/user";

export class ApiUserRoute {

    static route(server: ExpressWithAsync) {
        Log.info("EXPRESS", "Registering ApiUserRoute...");

        // Get user information
        server.getAsync("/api/info", async (req, res) => {
            let user: User = await req["user"];
            user.passwordSalt = undefined;
            user.passwordHash = undefined;
            user.isAdmin = undefined;
            res.send(user);
        });
    }
}
