import {User} from "../db/orm/user";
import * as crypto from "crypto"
import {DBManager} from "../db/DBManager";
import {Util} from "../common/util";

export class UserActions {

    static async createNewUser(username: string, email: string, password: string, isActivated?: boolean, isAdmin?: boolean): Promise<User> {
        let userCheck = await DBManager.DBM.getUsers().findOne({username: username});

        if (userCheck != null) {
            throw new Error("User with username " + username + " already exists!");
        }
        userCheck = await DBManager.DBM.getUsers().findOne({email: email});

        if (userCheck != null) {
            throw new Error("User with username " + email + " already exists!");
        }

        let user = new User();
        user.username = username;
        user.email = email;
        user.passwordSalt = Util.randomString(24);
        user.passwordHash = this.hashPassword(password, user.passwordSalt);
        user.isActivated = isActivated ? isActivated : true; // false
        user.isAdmin = isAdmin ? isAdmin : false;
        await DBManager.DBM.save(user);
        return user;
    }

    static async activateUser(username: string) {
        let user = await DBManager.DBM.getUsers().findOne({username: username});
        if (user == null) {
            throw new Error("User with username " + username + " doesn't exist");
        }

        user.isActivated = true;
        await DBManager.DBM.save(user);
    }

    static async deactivateUser(username: string) {
        let user = await DBManager.DBM.getUsers().findOne({username: username});
        if (user == null) {
            throw new Error("User with username " + username + " doesn't exist");
        }

        user.isActivated = false;
        await DBManager.DBM.save(user);
    }

    static async setAdmin(username: string) {
        let user = await DBManager.DBM.getUsers().findOne({username: username});
        if (user == null) {
            throw new Error("User with username " + username + " doesn't exist");
        }

        user.isAdmin = true;
        await DBManager.DBM.save(user);
    }

    static async revokeAdmin(username: string) {
        let user = await DBManager.DBM.getUsers().findOne({username: username});
        if (user == null) {
            throw new Error("User with username " + username + " doesn't exist");
        }

        user.isAdmin = false;
        await DBManager.DBM.save(user);
    }

    static async changePassword(username: string, newPassword: string) {
        let user = await DBManager.DBM.getUsers().findOne({username: username});
        if (user == null) {
            throw new Error("User with username " + username + " doesn't exist");
        }

        user.passwordSalt = Util.randomString(24);
        user.passwordHash = this.hashPassword(newPassword, user.passwordSalt);
        await DBManager.DBM.save(user);
    }

    static async deleteUser(username: string) {
        let user = await DBManager.DBM.getUsers().findOne({username: username});
        if (user == null) {
            throw new Error("User with username " + username + " doesn't exist");
        }

        await DBManager.DBM.getSessions().delete({user: user});
        await DBManager.DBM.getAssignments().delete({owner: user});
        await DBManager.DBM.getClasses().delete({owner: user});
        await DBManager.DBM.getUsers().delete({id: user.id});
    }

    static hashPassword(password: string, salt: string): string {
        let hash = crypto.createHmac('sha512', salt);
        hash.update(password);
        return hash.digest('hex');
    }
}
