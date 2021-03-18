export class Branch  {
    public branch_id: number;
    public branch_name: string;
    public branch_number: number;
    public createdAt: string;
    public updatedAt: string;
    
    deserialize(input) {
        if(!input) {
            return;
        }
        this.branch_id = input.id;
        this.branch_name = input.branch_name;
        this.branch_number = input.phone;
        this.createdAt = input.created_at;
        this.updatedAt = input.updated_at;
        return this;
    }

    get branchId() {
        return this.branch_id;
    }

    get branchName() {
        return this.branch_name
    }

    get branchNumber() {
        return this.branch_number;
    }
}