import * as crypto from "crypto"

export class Util {

    static randomString(size: number): string {
        return crypto.randomBytes(size).toString('hex');
    }

    static convertTZ(date, tzString) {
        return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));
    }


}
