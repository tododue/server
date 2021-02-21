import {ExpressWithAsync} from "@awaitjs/express";
import {Log} from "../../log";

export class HubRoute {

	static route(server: ExpressWithAsync) {
		Log.info("EXPRESS", "Registering HubRoute...");

		server.get("/hub", (req, res) => {
				res.render('hub', {"username": req["user"]});
		});
	}
}
