import {ExpressWithAsync} from "@awaitjs/express";
import {isEmpty} from "class-validator";
import {ResponseUtils} from "../../common/responseUtils";
import {DBManager} from "../../db/DBManager";

export class ApiRoute {

    static route(server: ExpressWithAsync) {

        // Check for authentication before running any API calls
        server.use("/api*", (req, res, next) => {
            let token = req.token;
            if (isEmpty(token)) {
                token = req.cookies["token"];
            }
            if (isEmpty(token)) {
                ResponseUtils.error(res, "No token sent");
                return;
            }

            DBManager.DBM.getSessions().findOne({token: token});


            next();
        });
    }

}
