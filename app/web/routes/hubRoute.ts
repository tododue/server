import {ExpressWithAsync} from "@awaitjs/express";
import {Log} from "../../log";
import {User} from "../../db/orm/user";

export class HubRoute {

	static route(server: ExpressWithAsync) {
		Log.info("EXPRESS", "Registering HubRoute...");

		server.get("/hub", (req, res) => {
			let user: User = req["user"];
			res.render('hub', {"user": user});
		});
	}
}
