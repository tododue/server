export class Log {

    static info(title: string, message?: string) {
        if (message) {
            console.log(`[${title}] ${message}`);
        } else {
            console.log(`[*] ${message}`);
        }
    }

    static error(title: string, message?: string) {
        this.info(title, message);
    }

}
