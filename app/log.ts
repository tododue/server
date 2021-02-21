export class Log {

    static info(title: string, message?: string) {
        if (message) {
            console.log(`[${title}] ${message}`);
        } else {
            console.log(`[*] ${title}`);
        }
    }

    static error(title: string, message?: string) {
        this.info(title, message);
    }

}
