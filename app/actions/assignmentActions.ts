import {Platform} from "../common/platform";
import {Class} from "../db/orm/class";
import {User} from "../db/orm/user";
import {Assignment} from "../db/orm/assignment";
import {DBManager} from "../db/DBManager";

export class AssignmentActions {

    static async createAssignment(owner: User, aClass: Class, platform: Platform, identifier: string, name: string, due: Date, close: Date): Promise<Assignment> {
        let assignment = new Assignment();
        assignment.owner = owner;
        assignment.class = aClass;
        assignment.platform = platform;
        assignment.identifier = identifier;
        assignment.name = name;
        assignment.due = due;
        assignment.close = close;

        await DBManager.DBM.save(assignment);
        return assignment;
    }

    static async renameAssignment(id: number, name: string) {
        let assignment = await DBManager.DBM.getAssignments().findOne({id: id});
        if (assignment == null) {
            throw new Error("Assignment doesn't exist");
        }
        assignment.overrideName = name;
        await DBManager.DBM.save(assignment);
    }

    static async changeDue(id: number, due: Date) {
        let assignment = await DBManager.DBM.getAssignments().findOne({id: id});
        if (assignment == null) {
            throw new Error("Assignment doesn't exist");
        }
        assignment.due = due;
        await DBManager.DBM.save(assignment);
    }

    static async changeClose(id: number, close: Date) {
        let assignment = await DBManager.DBM.getAssignments().findOne({id: id});
        if (assignment == null) {
            throw new Error("Assignment doesn't exist");
        }
        assignment.close = close;
        await DBManager.DBM.save(assignment);
    }

    static async changeComplete(id: number, complete: boolean) {
        let assignment = await DBManager.DBM.getAssignments().findOne({id: id});
        if (assignment == null) {
            throw new Error("Assignment doesn't exist");
        }
        assignment.overrideComplete = complete;
        await DBManager.DBM.save(assignment);
    }

    static async changeHidden(id: number, hidden: boolean) {
        let assignment = await DBManager.DBM.getAssignments().findOne({id: id});
        if (assignment == null) {
            throw new Error("Assignment doesn't exist");
        }
        assignment.hidden = hidden;
        await DBManager.DBM.save(assignment);
    }


}
