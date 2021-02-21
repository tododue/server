import {ExpressWithAsync} from "@awaitjs/express";
import {Log} from "../../../log";
import {isEmpty} from "class-validator";
import {ResponseUtils} from "../../../common/responseUtils";
import {DBManager} from "../../../db/DBManager";
import {User} from "../../../db/orm/user";
import {AssignmentActions} from "../../../actions/assignmentActions";
import {Platform} from "../../../common/platform";
import {ClassActions} from "../../../actions/classActions";

export class ApiAssignmentRoute {

    static route(server: ExpressWithAsync) {
        Log.info("EXPRESS", "Registering ApiAssignmentRoute...");

        // Upload of an assignment page by the extension
        server.postAsync("/api/upload", (req, res) => {
            let platform = req.body["platform"];
            let page = req.body["page"];

            if (isEmpty(platform) || isEmpty(page)) {
                ResponseUtils.error(res, "Platform or page not sent");
                return;
            }

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

        server.postAsync("/api/createCustomAssignment", async (req, res) => {
            let user: User = req["user"];

            let className = req.body["class"];
            let name = req.body["name"];
            let due = new Date(req.body["due"]);
            let closeRaw = req.body["close"];
            let close = due;

            let identifier = name;
            let platform = Platform.CUSTOM;
            if (closeRaw != null) {
                close = new Date(closeRaw);
            }

            if (isEmpty(className) || isEmpty(name) || isEmpty(due)) {
                ResponseUtils.error(res, "Class, name or due not sent");
                return;
            }

            let aClass = await ClassActions.getOrCreateClass(user, className);
            await AssignmentActions.createAssignment(user, aClass, platform, identifier, name, due, close);
            ResponseUtils.ok(res);
        });

        server.postAsync("/api/assignments", async (req, res) => {
            let user: User = req["user"];

            let includeHidden = req.body["includeHidden"];
            let ignoreCompleted = req.body["hideCompleted"];
            let ignorePast = req.body["hidePast"];
            let startDate = req.body["startDate"];
            let endDate = req.body["endDate"];
            let filterClassName = req.body["filterClassName"];
            let filterAssignmentName = req.body["filterAssignmentName"];

            let assignments = await DBManager.DBM.getAssignments().find({owner: user});

            // todo: implement filter rules

            let arr = [];
            assignments.forEach(assignment => {
                let obj = {};
                obj["id"] = assignment.id;
                obj["name"] = assignment.overrideName ? assignment.overrideName : assignment.name;
                obj["class"] = assignment.class.overrideName ? assignment.class.overrideName : assignment.class.name;
                obj["complete"] = assignment.overrideComplete ? assignment.overrideComplete : assignment.complete;
                obj["due"] = assignment.overrideDue ? assignment.overrideDue : assignment.due;
                obj["close"] = assignment.overrideClose ? assignment.overrideClose : assignment.close;
                obj["overrideNameSet"] = assignment.overrideName != null;
                obj["overrideCompleteSet"] = assignment.overrideComplete != null;
                obj["overrideDueSet"] = assignment.overrideDue != null;
                obj["overrideCloseSet"] = assignment.overrideClose != null;
                obj["note"] = assignment.note;
                obj["hidden"] = assignment.hidden;
                arr.push(obj);
            });
            res.send(arr);
        });

        server.getAsync("/api/assignmentsDueIn24h", async (req, res) => {
            let user: User = req["user"];
            let tomorrow = new Date(Date.now() + 86400000);

            let assignments = await DBManager.DBM.getAssignments().find({owner: user, hidden: false});
            let tomorrowAssignments = [];
            assignments.forEach(assignment => {
                if (assignment.due.getMilliseconds() + 86400000 > tomorrow.getMilliseconds()) {
                    tomorrowAssignments.push(assignment);
                }
            });

            let arr = [];
            tomorrowAssignments.forEach(assignment => {
                let obj = {};
                obj["id"] = assignment.id;
                obj["name"] = assignment.overrideName ? assignment.overrideName : assignment.name;
                obj["class"] = assignment.class.overrideName ? assignment.class.overrideName : assignment.class.name;
                obj["complete"] = assignment.overrideComplete ? assignment.overrideComplete : assignment.complete;
                obj["due"] = assignment.overrideDue ? assignment.overrideDue : assignment.due;
                obj["close"] = assignment.overrideClose ? assignment.overrideClose : assignment.close;
                obj["overrideNameSet"] = assignment.overrideName != null;
                obj["overrideCompleteSet"] = assignment.overrideComplete != null;
                obj["overrideDueSet"] = assignment.overrideDue != null;
                obj["overrideCloseSet"] = assignment.overrideClose != null;
                obj["note"] = assignment.note;
                obj["hidden"] = assignment.hidden;
                arr.push(obj);
            });
            res.send(arr);
        });
    }
}
