// Entry point of server - Happy 100
import {DBManager} from "./app/db/DBManager";
import {Log} from "./app/log";
import {StartupTasks} from "./app/tasks/startupTasks";

(async () => {
    // Start Database Manager
    Log.info("STARTUP", "Starting DBM...");
    let DBM = new DBManager();
    DBManager.DBM = DBM;
    await DBM.init();

    // Execute startup tasks
    Log.info("STARTUP", "Executing startup tasks...");
    await StartupTasks.execute();

    // Start webserver
    Log.info("STARTUP", "Starting Express...");
    import("./app/web/express")
})();

