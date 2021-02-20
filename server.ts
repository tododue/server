// Entry point of server

// Execute check for Config.ts
import * as fs from "fs";
if (!fs.existsSync("./app/config.json")) {
    console.log("Could not find ./app/config.json! (Did you copy it from config.json.example?)");
    process.exit(1);
}

// Start webserver
import("./app/web/express")
