import * as cheerio from "cheerio";
import {User} from "../db/orm/user";
import {AssignmentActions} from "../actions/assignmentActions";
import {Platform} from "../common/platform";
import {ClassActions} from "../actions/classActions";
import {DBManager} from "../db/DBManager";

class MicroAssignment {

    name: string;
    class: string;
    due: Date;
    close: Date;


    constructor(name: string, aClass: string, due: Date) {
        this.name = name;
        this.class = aClass;
        this.due = due;
        this.close = due;
    }
}

export class ParserMyCourses {

    static smartAdd(assignments: MicroAssignment[], newAssignment: MicroAssignment) {
        let set = false;
        assignments.forEach(loopAssignment => {
            if (loopAssignment.name == newAssignment.name && loopAssignment.class == newAssignment.class) {
                set = true;
                if (loopAssignment.due.getMilliseconds() > newAssignment.due.getMilliseconds()) {
                    loopAssignment.close = new Date(loopAssignment.due.getMilliseconds());
                    loopAssignment.due = new Date(newAssignment.due.getMilliseconds());
                } else {
                    loopAssignment.close = new Date(newAssignment.due.getMilliseconds());
                    loopAssignment.due = new Date(loopAssignment.due.getMilliseconds());
                }
            }
        });
        if (set == false) {
            assignments.push(newAssignment);
        }
    }

    static runParse(page: string, user: User) {

        const $ = cheerio;
        const list = $("#eventIds > ul", page);
        let assignments: MicroAssignment[] = [];

        list.children().each((index, element) => {
            try {
                let className = $(".d2l-le-calendar-dot-circle", element)[0].attribs["title"];
                let assignmentName = $($(".d2l-textblock", element)[0]).text();
                let dueDate = new Date($($(".d2l-textblock", element)[1]).text());
                if (assignmentName.includes(" - Due")) {
                    assignmentName = assignmentName.replace(" - Due", "");
                    this.smartAdd(assignments, new MicroAssignment(assignmentName, className, dueDate));
                }
                if (assignmentName.includes(" - Availability Ends")) {
                    assignmentName = assignmentName.replace(" - Availability Ends", "")
                    this.smartAdd(assignments, new MicroAssignment(assignmentName, className, dueDate));
                }
            } catch (ignored) {
            }
        });

        (async () => {
            for (const assignment of assignments) {
                let aClass = await ClassActions.getOrCreateClass(user, assignment.class, Platform.RIT_MYCOURSES);
                let realAssignment = await AssignmentActions.getOrCreateAssignment(user, aClass, Platform.RIT_MYCOURSES, assignment.name, assignment.due, assignment.close);
                realAssignment.due = assignment.due;
                realAssignment.close = assignment.close;
                await DBManager.DBM.save(realAssignment);
            }
        })();

    }
}
