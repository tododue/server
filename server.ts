// Entry point of server

// Execute check for Config.ts
import * as fs from "fs";
if (!fs.existsSync("./app/config.ts")) {
    console.log("Could not find ./app/config.ts! (Did you copy it from config.ts.example?)");
    process.exit(1);
}

// Start webserver
import("./app/web/express")
