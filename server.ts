// Entry point of server
import * as fs from "fs";
import {DBManager} from "./app/db/DBManager";
import {Log} from "./app/log";

// Execute check for config.json
Log.info("STARTUP", "Starting preflight check...");
if (!fs.existsSync("./config.json")) {
    console.error("Could not find ./config.json! (Did you copy it from config.json.example?)");
    process.exit(1);
}
Log.info("STARTUP", "Preflight check complete!");

// Start Database Manager
Log.info("STARTUP", "Starting DBM...");
let DBM = new DBManager();
DBManager.DBM = DBM;
DBM.init();

// Start webserver
Log.info("STARTUP", "Starting Express...");
import("./app/web/express")
