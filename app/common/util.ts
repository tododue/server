import * as crypto from "crypto"

export class Util {

    static randomString(size: number): string {
        return crypto.randomBytes(size).toString('hex');
    }

}
