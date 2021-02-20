import {Connection, createConnection} from "typeorm";
import {Config} from "../config";
import {Log} from "../log";

export class DBManager {

    static DBM: DBManager;
    private sqlConnection: Connection;

    async init() {
        await createConnection({
            type: "mysql",
            host: Config.DB_HOST,
            port: Config.DB_PORT,
            database: Config.DB_DATABASE,
            username: Config.DB_USER,
            password: Config.DB_PASSWORD,
            entities: [],
            synchronize: true,
            logging: Config.DEBUG_MODE
        }).catch(error => {
            console.error("There was a database connection error! Exiting...");
            console.log(error);
            process.exit(1);
        }).then(connection => {
           this.sqlConnection = connection;
           Log.info("DBM", `Service Online! SQL Connection '${this.sqlConnection.name}' operational`);
        });
    }


}
