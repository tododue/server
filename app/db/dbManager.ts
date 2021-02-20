import {Connection, createConnection} from "typeorm";
import {Config} from "../config";
import {Log} from "../log";
import {User} from "./orm/user";
import {Assignment} from "./orm/assignment";
import {Class} from "./orm/class";

export class DbManager {

    static DBM: DbManager;
    private sqlConnection: Connection;

    async init() {
        await createConnection({
            type: "mysql",
            host: Config.DB_HOST,
            port: Config.DB_PORT,
            database: Config.DB_DATABASE,
            username: Config.DB_USER,
            password: Config.DB_PASSWORD,
            entities: [User, Assignment, Class],
            synchronize: true,
            logging: Config.DEBUG_MODE
        }).catch(error => {
            Log.error("DBM", "There was a database connection error! Exiting...");
            console.log(error);
            process.exit(1);
        }).then(connection => {
            this.sqlConnection = connection;
            Log.info("DBM", `Service Online! SQL Connection '${this.sqlConnection.name}' operational`);
        });
    }

    getUsers() {
        return this.sqlConnection.getRepository(User);
    }

    getAssignments() {
        return this.sqlConnection.getRepository(Assignment);
    }

    getClasses() {
        return this.sqlConnection.getRepository(Class);
    }


}
