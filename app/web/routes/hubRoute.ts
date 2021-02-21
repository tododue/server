import {ExpressWithAsync} from "@awaitjs/express";
import {Log} from "../../log";
import {User} from "../../db/orm/user";
import {isEmpty} from "class-validator";
import {DBManager} from "../../db/DBManager";
import {SessionActions} from "../../actions/sessionActions";

export class HubRoute {

	static route(server: ExpressWithAsync) {
		Log.info("EXPRESS", "Registering HubRoute...");

		server.getAsync("/hub", async (req, res) => {
			let token = req["token"];
			if (isEmpty(token)) {
				token = req.cookies["token"];
			}
			if (isEmpty(token)) {
				res.redirect("/?error=login");
				return;
			}

			let session = await DBManager.DBM.getSessions().findOne({token: token});
			if (session == null) {
				res.redirect("/?error=login");
				return;
			}
			SessionActions.updateSession(session);
			let user: User = session.user;
			res.render('hub', {"user": user, "isAdmin": user.isAdmin});
		});
	}
}
