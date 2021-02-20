// Entry point of server

import * as fs from "fs";
import {DBManager} from "./app/db/dbmanager";

// Execute check for config.json
if (!fs.existsSync("./config.json")) {
    console.error("Could not find ./config.json! (Did you copy it from config.json.example?)");
    process.exit(1);
}

// Start Database Manager
let DBM = new DBManager();
DBManager.DBM = DBM;
DBM.init();

// Start webserver
import("./app/web/express")
