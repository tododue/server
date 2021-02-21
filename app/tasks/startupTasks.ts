import {DBManager} from "../db/DBManager";
import {Log} from "../log";
import {UserActions} from "../actions/userActions";

export class StartupTasks {

    static async execute() {

        let users = await DBManager.DBM.getUsers().find();
        if (users.length == 0) {
            // No users? Make root admin user!
            Log.info("STARTUP TASKS", "No users detected.. Creating root admin.");
            await UserActions.createNewUser("admin", "admin@example.com", "l33tadmin", true, true);
            Log.info("STARTUP TASKS", "Created user 'admin' with password 'l33tadmin'");


            Log.info("STARTUP TASKS", "Completed startup tasks!");
        }
    }
}
