import * as fs from "fs";

// Read config file
let configFile = fs.readFileSync("config.json");

// @ts-ignore JSON parse takes buffers but ts says it can't?
let config = JSON.parse(configFile);

export class Config {

    static DEBUG_MODE = config["DEBUG_MODE"];
    static APP_ADDRESS = config["APP_ADDRESS"];
    static APP_PORT = config["APP_PORT"];
    static DB_HOST = config["DB_HOST"];
    static DB_PORT = config["DB_PORT"];
    static DB_DATABASE = config["DB_DATABASE"];
    static DB_USER = config["DB_USER"];
    static DB_PASSWORD = config["DB_PASSWORD"];

    static ROOT = __dirname;

}
