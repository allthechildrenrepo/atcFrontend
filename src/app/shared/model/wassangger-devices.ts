
interface Queue {
    status: string,
    total: number,
    size: number,
    available: number
};

interface Session {
    status: string,
    operative: boolean,
    uptime: number,
    lastSyncAt: Date,
    appVersion: string,
    error: boolean
}

export class WassanggerDevice {
    public id: string;
    public phone: string;
    public deviceName: string;
    public wid: string;
    public status: string;
    public queue: Queue;
    public session: Session;
    public info: any;

    deserializer(input) {
        this.id = input.id;
        this.phone = input.phone;
        this.deviceName = input.alias;
        this.wid = input.wid;
        this.status = input.status;
        this.queue = input.queue;
        this.session = input.session;
        this.info = input.info;
        
        return this;
    }
}
