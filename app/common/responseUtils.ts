export class ResponseUtils {

    static ok(res: any) {
        res.send({error: 0, msg: "OK"});
    }

    static error(res: any, message) {
        res.status(400).send({error: 1, msg: message});
    }

}
