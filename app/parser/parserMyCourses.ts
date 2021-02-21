import * as cheerio from "cheerio";

export class parserMyCourses {

    static runParse(page: string) {

        const $ = cheerio;
        const list = $("#eventIds > ul", page);
        let assignments = [];

        list.children().each((index, element) => {
            try {
                let className = $(".d2l-le-calendar-dot-circle", element)[0].attribs["title"];
                let assignmentName = $($(".d2l-textblock", element)[0]).text();
                let dueDate = $($(".d2l-textblock", element)[1]).text();
                if (assignmentName.includes(" - Due") || assignmentName.includes(" - Availability Ends")) {
                    console.log(assignmentName + " | Class: " + className + " | Due: " + dueDate.replace(/\n/, ""));
                }
            } catch (ignored) {
            }
        });
    }


}
