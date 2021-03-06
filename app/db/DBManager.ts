import {Connection, createConnection} from "typeorm";
import {Config} from "../config";
import {Log} from "../log";
import {User} from "./orm/user";
import {Assignment} from "./orm/assignment";
import {Class} from "./orm/class";
import {SqlEntity} from "./sqlEntity";
import {validateOrReject} from "class-validator";
import {Session} from "./orm/session";

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
            entities: [User, Assignment, Class, Session],
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

    getSessions() {
        return this.sqlConnection.getRepository(Session);
    }

    getClasses() {
        return this.sqlConnection.getRepository(Class);
    }

    async save(entity: SqlEntity) {
        await validateOrReject(entity).catch((reason) => {
            throw reason;
        }).then(async () => {
            await this.sqlConnection.getRepository(entity.constructor.name).save(entity);
        });
    }


}
