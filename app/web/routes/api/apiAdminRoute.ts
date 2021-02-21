import {ExpressWithAsync} from "@awaitjs/express";
import {Log} from "../../../log";
import {User} from "../../../db/orm/user";
import {ResponseUtils} from "../../../common/responseUtils";
import {UserActions} from "../../../actions/userActions";
import {isEmpty} from "class-validator";

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

        server.postAsync("/api/admin/resetPassword", async (req, res) => {
            let username = req.body["username"];
            let password = req.body["password"];

            if (isEmpty(username) || isEmpty(password)) {
                ResponseUtils.error(res, "Empty username or password");
                return;
            }

            await UserActions.changePassword(username, password);
            ResponseUtils.ok(res);
        });

        server.deleteAsync("/api/admin/deleteUser", async (req, res) => {
            let username = req.body["username"];

            if (isEmpty(username)) {
                ResponseUtils.error(res, "Empty username");
                return;
            }

            await UserActions.deleteUser(username);
            ResponseUtils.ok(res);
        });

    }
}
