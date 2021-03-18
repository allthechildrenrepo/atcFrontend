export class BaseRequestModel {
    private created_at: Date;
    private no_of_leads: number;
    public status: number;
    private branch: number;
    public id: number;
    private requester: string;

    deserialize(input){
        this.created_at = input.created_at;
        this.no_of_leads = input.no_of_leads;
        this.id = input.id;
        this.status = input.status;
        this.branch = input.branch;
        this.requester = input.requester;

        return this;
    }

    get createdAt() {
        return this.created_at;
    }

    get noOfleads() {
        return this.no_of_leads;
    }

    get branchId() {
        return this.branch;
    }

    get leadRequester() {
        return this.requester;
    }

    get reqStatus(){
        switch(this.status) {
            case 0: return "Pending"
            case 1: return "Rejected"
            case 2: return "Approved"
            default: return "Pending"
        }
    }
}