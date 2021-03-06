import * as fs from "fs";
import * as path from "path";
import {Log} from "./log";

// Preflight check...
// Execute check for config.json
Log.info("STARTUP", "Starting preflight check...");
if (!fs.existsSync(path.join(process.cwd(), "config.json"))) {
    Log.error("PREFLIGHT", "Could not find ./config.json! (Did you copy it from config.json.example?)");
    Log.error("PREFLIGHT", "Stopping server...");
    process.exit(1);
}
Log.info("STARTUP", "Preflight check complete!");

// Read config file
let configFile = fs.readFileSync(path.join(process.cwd(), "config.json"));

// @ts-ignore JSON parse takes buffers but ts says it can't?
let configOptions = JSON.parse(configFile);

export class Config {

    static ROOT = path.join(process.cwd() + "/app");

    static DEBUG_MODE = configOptions["DEBUG_MODE"];
    static APP_ADDRESS = configOptions["APP_ADDRESS"];
    static APP_PORT = configOptions["APP_PORT"];
    static DB_HOST = configOptions["DB_HOST"];
    static DB_PORT = configOptions["DB_PORT"];
    static DB_DATABASE = configOptions["DB_DATABASE"];
    static DB_USER = configOptions["DB_USER"];
    static DB_PASSWORD = configOptions["DB_PASSWORD"];

    static SESSION_LENGTH = configOptions["SESSION_LENGTH"];
}
