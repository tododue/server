import {ExpressWithAsync} from "@awaitjs/express";
import {Log} from "../../log";
import {isEmpty} from "class-validator";
import {ResponseUtils} from "../../common/responseUtils";
import {DBManager} from "../../db/DBManager";
import {UserActions} from "../../actions/userActions";
import {SessionActions} from "../../actions/sessionActions";

export class SessionRoute {

    static route(server: ExpressWithAsync) {
        Log.info("EXPRESS", "Registering SessionRoute...");

        server.postAsync("/login", async (req, res) => {
            let username = req.body["username"];
            let password = req.body["password"];

            if (isEmpty(username) || isEmpty(password)) {
                ResponseUtils.error(res, "Empty username or password");
                return;
            }

            // TODO: Rate limiting

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

            let session = await SessionActions.createSession(user, "Login from " + req.socket.remoteAddress, false);
            session.id = undefined;
            session.user = undefined;
            res.send(session);
        });

        server.postAsync("/register", async (req, res) => {
            let username = req.body["username"];
            let email = req.body["email"];
            let password = req.body["password"];

            if (isEmpty(username) || isEmpty(email) || isEmpty(password)) {
                ResponseUtils.error(res, "Didn't send username, email or password");
                return;
            }

            // TODO: Rate limiting

            await UserActions.createNewUser(username, email, password).catch(reason => {
                ResponseUtils.error(res, reason);
            }).then(() => {
                ResponseUtils.ok(res);
            });
        });

    }
}
