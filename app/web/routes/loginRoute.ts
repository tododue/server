import {ExpressWithAsync} from "@awaitjs/express";
import {Log} from "../../log";
import {isEmpty} from "class-validator";
import {ResponseUtils} from "../../common/responseUtils";
import {DBManager} from "../../db/DBManager";
import {UserActions} from "../../actions/userActions";
import {SessionActions} from "../../actions/sessionActions";

export class LoginRoute {

    static route(server: ExpressWithAsync) {
        Log.info("EXPRESS", "Registering LoginRoute...");

        server.postAsync("/login", async (req, res) => {
            let username = req.body["username"];
            let password = req.body["password"];

            if (isEmpty(username) || isEmpty(password)) {
                ResponseUtils.error(res, "Empty username or password");
                return;
            }

            let user = await DBManager.DBM.getUsers().findOne({username: username});
            if (user == null) {
                ResponseUtils.error(res, "Invalid username or password");
                return;
            }

            if (!user.isActivated) {
                ResponseUtils.error(res, "User is not activated");
                return;
            }

            let passwordHash = UserActions.hashPassword(password, user.passwordSalt);
            if (user.passwordHash != passwordHash) {
                ResponseUtils.error(res, "Invalid username or password");
                return;
            }

            let session = await SessionActions.createSession(user, "Login from " + req.socket.address(), false);
            session.id = undefined;
            session.user = undefined;
            res.send(session);
        });

    }
}
