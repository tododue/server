import {Platform} from "../common/platform";
import {User} from "../db/orm/user";
import {Class} from "../db/orm/class";
import {DbManager} from "../db/dbManager";

export class ClassActions {

    static async createClass(owner: User, platform: Platform, identifier: string, name: string): Promise<Class> {
        let aClass = new Class();
        aClass.owner = owner;
        aClass.identifier = identifier;
        aClass.platform = platform;
        aClass.name = name;
        await DbManager.DBM.save(aClass);
        return aClass;
    }


}
