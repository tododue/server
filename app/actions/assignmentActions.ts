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

    static async getOrCreateAssignment(owner: User, aClass: Class, platform: Platform, identifier: string, due: Date, close?: Date) {
        let assignment = await DBManager.DBM.getAssignments().findOne({
            owner: owner,
            class: aClass,
            platform: platform,
            identifier: identifier
        });

        if (assignment == null) {
            assignment = await this.createAssignment(owner, aClass, platform, identifier, identifier, due, close ? close : due);
        }

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

    static async updateAssignment(assignment: Assignment, changes: object) {
        let keys = Object.keys(changes);

        let name = changes["name"];
        let due = changes["due"];
        let close = changes["close"];
        let complete = changes["complete"];
        let note = changes["note"];
        let hidden = changes["hidden"];

        if (keys.includes("name")) {
            assignment.overrideName = name;
        }
        if (keys.includes("due")) {
            assignment.overrideDue = due;
        }
        if (keys.includes("close")) {
            assignment.overrideClose = close;
        }
        if (keys.includes("complete")) {
            assignment.overrideComplete = complete;
        }
        if (keys.includes("note")) {
            assignment.note = note;
        }
        if (keys.includes("hidden")) {
            assignment.hidden = hidden;
        }

        await DBManager.DBM.save(assignment);
    }

    static async updateAssignmentRaw(assignment: Assignment, changes: object) {
        let keys = Object.keys(changes);

        let name = changes["name"];
        let due = changes["due"];
        let close = changes["close"];
        let complete = changes["complete"];
        let note = changes["note"];
        let hidden = changes["hidden"];

        if (keys.includes("name")) {
            assignment.name = name;
        }
        if (keys.includes("due")) {
            assignment.due = due;
        }
        if (keys.includes("close")) {
            assignment.close = close;
        }
        if (keys.includes("complete")) {
            assignment.complete = complete;
        }
        if (keys.includes("note")) {
            assignment.note = note;
        }
        if (keys.includes("hidden")) {
            assignment.hidden = hidden;
        }
        await DBManager.DBM.save(assignment);
    }


}
