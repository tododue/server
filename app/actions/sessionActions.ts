import {Session} from "../db/orm/session";
import {Util} from "../common/util";
import {User} from "../db/orm/user";
import {Config} from "../config";
import {DBManager} from "../db/DBManager";

export class SessionActions {

    static async createSession(user: User, message: string, noExpiry?: boolean): Promise<Session> {
        let session = new Session();
        session.user = user;
        session.message = message;
        session.token = Util.randomString(32);
        session.expiry = noExpiry ? new Date(9999, 12) : new Date(Date.now() + Config.SESSION_LENGTH);
        await DBManager.DBM.save(session);
        return session;
    }

    static async updateSession(session: Session) {
        session.expiry = new Date(Date.now() + Config.SESSION_LENGTH);
        await DBManager.DBM.save(session);
    }


}
