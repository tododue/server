import {ExpressWithAsync} from "@awaitjs/express";
import {Log} from "../../../log";
import {User} from "../../../db/orm/user";
import {Session} from "../../../db/orm/session";
import {SessionActions} from "../../../actions/sessionActions";
import {ResponseUtils} from "../../../common/responseUtils";

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

        server.getAsync("/api/logout", async (req, res) => {
            let session: Session = req["session"];
            await SessionActions.invalidateSession(session);
            ResponseUtils.ok(res);
        });

        server.getAsync("/api/logoutAll", async (req, res) => {
            let user: User = req["user"];
            await SessionActions.invalidateAllSessions(user);
            ResponseUtils.ok(res);
        });
    }
}
