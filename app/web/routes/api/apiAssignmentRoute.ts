import {ExpressWithAsync} from "@awaitjs/express";
import {Log} from "../../../log";
import {isEmpty} from "class-validator";
import {ResponseUtils} from "../../../common/responseUtils";
import {DBManager} from "../../../db/DBManager";
import {User} from "../../../db/orm/user";
import {AssignmentActions} from "../../../actions/assignmentActions";

export class ApiAssignmentRoute {

    static route(server: ExpressWithAsync) {
        Log.info("EXPRESS", "Registering ApiAssignmentRoute...");

        // Upload of an assignment page by the extension
        server.postAsync("/api/upload", (req, res) => {
            let platform = req.body["platform"];
            let page = req.body["page"];

            // parser

        });

        server.postAsync("/api/updateAssignment", async (req, res) => {
            let user: User = req["user"];
            let assignmentId = req.body["id"];

            if (isEmpty(assignmentId)) {
                ResponseUtils.error(res, "Assignment ID not sent");
                return;
            }

            let assignment = await DBManager.DBM.getAssignments().findOne({id: assignmentId});
            if (assignment == null) {
                ResponseUtils.error(res, "Assignment with that ID does not exist");
                return;
            }

            if (assignment.owner != user) {
                ResponseUtils.error(res, "Assignment does not belong to you");
                return;
            }

            await AssignmentActions.updateAssignment(assignment, req.body);
            ResponseUtils.ok(res);
        });
    }
}
