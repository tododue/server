import {Platform} from "../common/platform";
import {User} from "../db/orm/user";
import {ParserMyCourses} from "./parserMyCourses";

export class ParserManager {

    static parse(platform: Platform, user: User, page: string) {

        if (platform == Platform.RIT_MYCOURSES) {
            ParserMyCourses.runParse(page, user);
        }

    }


}
