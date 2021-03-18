export class GenericServerResponse {
    public status: string;
    public message: string;
    public result: any;

    desrialize(input) {
        this.status = input.status;
        this.message = input.message;
        this.result = input.result;
        return this;
    }
}