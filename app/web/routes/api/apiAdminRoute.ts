import {ExpressWithAsync} from "@awaitjs/express";
import {Log} from "../../../log";
import {User} from "../../../db/orm/user";
import {ResponseUtils} from "../../../common/responseUtils";

export class ApiAdminRoute {

    static route(server: ExpressWithAsync) {
        Log.info("EXPRESS", "Registering APIAdminRoute...");

        server.useAsync("/api/admin*", (req, res, next) => {
            let user: User = req["user"];

            if (!user.isAdmin) {
                ResponseUtils.error(res, "Insufficient Permissions");
                return;
            }

            next();
        })
    }
}
