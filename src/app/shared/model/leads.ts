export class Leads { 
    private branch: number
    private created_at: Date;
    private first_name: string;
    private id: number;
    private last_name: string
    private phone1: string;
    private phone2: string;
    public remarks: string;
    public status: number
    private telecaller_id: string;

    deserializer(input) {
    this.branch = input.branch;
    this.created_at = input.created_at;
    this.first_name = input.first_name;
    this.id = input.id;
    this.last_name = input.last_name;
    this.phone1  = input.phone1;
    this.phone2 = input.phone2;
    this.remarks = input.remarks;
    this.status = input.status;
    this.telecaller_id = input.telecaller_id;

    return this;
    }

    get createdAt() {
        return this.created_at;
    }

    get fullName() {
        return this.first_name+ " " + this.last_name;
    }

    get phone() {
        return this.phone1;
    }

    get leadId() {
        return this.id;
    }
    
    get teleCallerId() {
        return this.telecaller_id;
    }

    get isTelecalerassigned() {
        return this.telecaller_id ? true: false;
    }

    /**
     *   CREATED = 0
        BRANCH_ASSIGNED = 1
        TELECALLER_ASSIGNED = 2
        NOT_INTRESTED = 3
        CONVERT_TO_CONTACT = 4

     */
    get statusCode() {
        switch(this.status) {
            case 0: return "CREATED";
            case 1: return "BRANCH ASSIGNED";
            case 2: return "TELECALLER ASSIGNED";
            case 3: return "Remarks Given";
            default: return "CONVERTED TO DONAR";
        }
    }


}