import {ExpressWithAsync} from "@awaitjs/express";
import {isEmpty} from "class-validator";
import {ResponseUtils} from "../../../common/responseUtils";
import {DBManager} from "../../../db/DBManager";
import {User} from "../../../db/orm/user";
import {SessionActions} from "../../../actions/sessionActions";
import {Log} from "../../../log";

export class ApiDefaultRoute {

    static route(server: ExpressWithAsync) {
        Log.info("EXPRESS", "Registering APIDefaultRoute...");

        // Check for authentication before running any API calls
        server.useAsync("/api*", async (req, res, next) => {
            let token = req["token"];
            if (isEmpty(token)) {
                token = req.cookies["token"];
            }
            if (isEmpty(token)) {
                ResponseUtils.error(res, "No token sent");
                return;
            }

            let session = await DBManager.DBM.getSessions().findOne({token: token});
            if (session == null) {
                ResponseUtils.error(res, "Invalid token");
                return;
            }

            SessionActions.updateSession(session);
            req["user"] = session.user;
            next();
        });

        // Get user information
        server.getAsync("/api/info", async (req, res) => {
            let user: User = await req["user"];
            user.passwordSalt = undefined;
            user.passwordHash = undefined;
            user.isAdmin = undefined;
            res.send(user);
        });

        server.postAsync("/login", async (req, res) => {

        });


    }

}
