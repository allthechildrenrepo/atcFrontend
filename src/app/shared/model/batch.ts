import { DonationTransaction } from "./donation-transaction";
import { Branch } from './branch';

export class Batch {
  public id: string;
  public name: string;
  public created_at: Date;
  public updated_at: Date;
  public branch_id: string;
  public branch: Branch;
  public donations: DonationTransaction[] = [];

  deserialize(input) {
    this.id = input.id;
    this.name = input.name;
    this.created_at = input.created_at;
    this.updated_at = input.updated_at;
    this.branch = new Branch().deserialize(input.branch);
    this.donations= [];
    input.donation.forEach(trans =>
        this.donations.push(new DonationTransaction().deserialize(trans))
    );

    return this;
  }

  get batchName() {
    return this.branch.branchName + "-" + this.id
  }
}
