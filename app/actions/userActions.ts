import {User} from "../db/orm/user";
import * as crypto from "crypto"
import {DbManager} from "../db/dbManager";

export class UserActions {

    static async createNewUser(username: string, email: string, password: string, isActivated?: boolean, isAdmin?: boolean): Promise<User> {
        if (await DbManager.DBM.getUsers().find({username: username})) {
            throw new Error("User with username " + username + " already exists!");
        }

        if (await DbManager.DBM.getUsers().find({email: email})) {
            throw new Error("User with username " + email + " already exists!");
        }

        let user = new User();
        user.username = username;
        user.email = email;
        user.passwordSalt = this.generateSalt();
        user.passwordHash = this.hashPassword(password, user.passwordSalt);
        user.isActivated = isActivated ? isActivated : false;
        user.isAdmin = isAdmin ? isAdmin : false;
        await DbManager.DBM.save(user);
        return user;
    }

    static async activateUser(username: string) {
        let user = await DbManager.DBM.getUsers().findOne({username: username});
        if (user == null) {
            throw new Error("User with username " + username + " doesn't exist");
        }

        user.isActivated = true;
        await DbManager.DBM.save(user);
    }

    static async deactivateUser(username: string) {
        let user = await DbManager.DBM.getUsers().findOne({username: username});
        if (user == null) {
            throw new Error("User with username " + username + " doesn't exist");
        }

        user.isActivated = false;
        await DbManager.DBM.save(user);
    }

    static async setAdmin(username: string) {
        let user = await DbManager.DBM.getUsers().findOne({username: username});
        if (user == null) {
            throw new Error("User with username " + username + " doesn't exist");
        }

        user.isAdmin = true;
        await DbManager.DBM.save(user);
    }

    static async revokeAdmin(username: string) {
        let user = await DbManager.DBM.getUsers().findOne({username: username});
        if (user == null) {
            throw new Error("User with username " + username + " doesn't exist");
        }

        user.isAdmin = false;
        await DbManager.DBM.save(user);
    }

    static async changePassword(username: string, newPassword: string) {
        let user = await DbManager.DBM.getUsers().findOne({username: username});
        if (user == null) {
            throw new Error("User with username " + username + " doesn't exist");
        }

        user.passwordSalt = this.generateSalt();
        user.passwordHash = this.hashPassword(newPassword, user.passwordSalt);
        await DbManager.DBM.save(user);
    }

    static hashPassword(password: string, salt: string): string {
        let hash = crypto.createHmac('sha512', salt);
        hash.update(password);
        return hash.digest('hex');
    }

    static generateSalt(): string {
        return crypto.randomBytes(24).toString('hex');
    }


}
