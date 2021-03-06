import {User} from "../db/orm/user";
import * as cheerio from "cheerio";
import {ClassActions} from "../actions/classActions";
import {Platform} from "../common/platform";
import {AssignmentActions} from "../actions/assignmentActions";
import {DBManager} from "../db/DBManager";

class MicroAssignment {

    name: string;
    class: string;
    due: Date;

    constructor(name: string, aClass: string, due: Date) {
        this.name = name;
        this.class = aClass;
        this.due = due;
    }
}

export class ParserWebWork {

    static runParse(page: string, user: User) {

        const $ = cheerio;
        const list = $("table tbody", page);
        const aClass = $("#page-title", page).text();
        let assignments = [];
        let statusRow = 2;

        let i = -1;
        list.children().each((index, element) => {
            i++;
            if (i == 0) {
                let j = 0;
                let root = $(element).children();
                root.each(i => {
                    if ($(root[i]).text() == "Status") {
                        statusRow = j;
                    }
                    j++;
                });
                return;
            }
            let assignmentName = $($(element).children()[1]).text();
            let dueDate = $($(element).children()[statusRow]).text();
            if (dueDate.includes("Open, closes ")) {
                dueDate = dueDate.replace("Open, closes ", "");
                dueDate = dueDate.replace("/", "-");
                dueDate = dueDate.replace("/", "-");
                let dateSplit = dueDate.split(" ");
                if (dateSplit[2].includes("pm")) {
                    dateSplit[2] = dateSplit[2].replace("pm", "");
                    let timeSplit = dateSplit[2].split(":");
                    timeSplit[0] = String(parseInt(timeSplit[0]) + 12);
                    dateSplit[2] = timeSplit[0] + ":" + timeSplit[1];
                } else {
                    dateSplit[2] = dateSplit[2].replace("am", "");
                }
                let finalDate = dateSplit[0] + " " + dateSplit[2];
                assignments.push(new MicroAssignment(assignmentName, aClass, new Date(finalDate)));
            }
        });

        (async () => {
            for (const assignment of assignments) {
                let aClass = await ClassActions.getOrCreateClass(user, assignment.class, Platform.RIT_WEBWORK);
                let realAssignment = await AssignmentActions.getOrCreateAssignment(user, aClass, Platform.RIT_WEBWORK, assignment.name, assignment.due, assignment.due);
                realAssignment.due = assignment.due;
                realAssignment.close = assignment.due;
                await DBManager.DBM.save(realAssignment);
            }
        })();

    }
}
