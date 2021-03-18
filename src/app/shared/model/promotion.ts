export class Promotion {
    public id: number;
    public consumer_file: File;
    public created_by: any;
    public device_id: string;
    public cron_time: string;
    public files: any[];
    public message: string;
    public status: number;
    public name: string;
    public created_at: Date;
    public scheduled_date: Date;

    deserializer(input) {
        this.id = input.id;
        this.consumer_file = input.consumer_file;
        this.created_by = input.created_by;
        this.device_id = input.device_id;
        this.cron_time = input.cron_time;
        this.files = input.files;
        this.message = input.message;
        this.status = input.status;
        this.name = input.name;
        this.created_at = input.created_at;
        this.scheduled_date = input.scheduled_date;

        return this;
    }

    get statusCode() {
        switch (this.status) {
            case 0:
                return "Scheduled";
            case 1:
                return "Processing";
            case 2:
                return "Completed";
            case 3:
                return "Stopped";
            case 4:
                return "Paused";
        }
    }

    get isActive() {
        return this.status == 0 || this.status == 1;
    }
}