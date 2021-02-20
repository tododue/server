// Entry point of server

// Execute check for Config.ts
import * as fs from "fs";
if (!fs.existsSync("./config.json")) {
    console.error("Could not find ./config.json! (Did you copy it from config.json.example?)");
    process.exit(1);
}

// Start webserver
import("./app/web/express")
