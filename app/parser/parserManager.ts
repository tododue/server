import {Platform} from "../common/platform";
import {User} from "../db/orm/user";
import {ParserMyCourses} from "./parserMyCourses";
import {ParserWebWork} from "./parserWebWork";

export class ParserManager {

    static parse(platform: Platform, user: User, page: string) {

        if (platform == Platform.RIT_MYCOURSES) {
            ParserMyCourses.runParse(page, user);
        }

        if (platform == Platform.RIT_WEBWORK) {
            ParserWebWork.runParse(page, user);
        }

    }


}
