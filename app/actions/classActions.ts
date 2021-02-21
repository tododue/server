import {Platform} from "../common/platform";
import {User} from "../db/orm/user";
import {Class} from "../db/orm/class";
import {DBManager} from "../db/DBManager";

export class ClassActions {

    static async createClass(owner: User, platform: Platform, identifier: string, name: string): Promise<Class> {
        let aClass = new Class();
        aClass.owner = owner;
        aClass.identifier = identifier;
        aClass.platform = platform;
        aClass.name = name;
        await DBManager.DBM.save(aClass);
        return aClass;
    }

    static async getOrCreateClass(owner: User, platform: Platform, identifier: string): Promise<Class> {
        let aClass = await DBManager.DBM.getClasses().findOne({
            owner: owner,
            platform: platform,
            identifier: identifier
        });

        if (aClass == null) {
            aClass = await this.createClass(owner, platform, identifier, identifier);
            await DBManager.DBM.save(aClass);
        }

        return aClass;
    }


}
