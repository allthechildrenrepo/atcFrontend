import { AtcUser } from "./atc-user";
import { Branch } from './branch';

export class DonationTransaction {
  public id: number;
  public donar: AtcUser;
  public transaction_id: any;
  public amount: number;
  public cheque_number: string;
  public screenshot_url: any;
  public is_verified: boolean;
  public verification_attempt: boolean;
  public provision: string;
  public telecaller: AtcUser;
  public mode_of_transaction: string;
  public receipt_id: string;
  public created_at: Date;
  public updated_at: Date;
  public is_80g: boolean;
  public branch: Branch;
  public receipt_send: boolean;
  public approved_by: any;
  public donated_date: Date;
  public receipt_name: string;
  public wishes_requested: boolean;
  public wishes_sent: boolean;
  public _status: number;
  public remarks: string;
  public sign: boolean;
  public agentName: string;
  public pickup_address: string;
  public pickup_time: string;
  public donor_type: string;
  public donated_bank: string;

  deserialize(input) {
    if (!input) {
      return this;
    }
    this.id = input.id;
    this.donar = new AtcUser().deserialize(input.donar);
    this.transaction_id = input.transaction_id;
    this.amount = input.amount;
    this.cheque_number = input.cheque_number;
    this.screenshot_url = input.transaction_image;
    this.is_verified = input.is_verified;
    this.verification_attempt = input.verification_attempt;
    this.provision = input.provision;
    if (input.telecaller_id){
      this.telecaller = new AtcUser().deserialize(input.telecaller_id);
    }
    this.mode_of_transaction = input.mode_of_transaction_id;
    this.receipt_id = input.receipt_id;
    this.created_at = input.created_at;
    this.updated_at = input.updated_at;
    this.is_80g = input.is_80g;
    this.branch = new Branch().deserialize(input.branch);
    this.receipt_send = input.receipt_send;
    this.donated_date = input.donar_req_date;
    this.receipt_name = input.donar_req_recipient_name;
    this.wishes_requested = input.wishes_requested;
    this.wishes_sent = input.wishes_sent;
    this.approved_by = input.approved_by;
    this._status = input.status;
    this.remarks = input.remarks;
    this.agentName = input.pickup_agent;
    this.pickup_address = input.pickup_address;
    this.donor_type = input.donar_type;
    this.donated_bank = input.donated_bank;
    this.pickup_time = input.pickup_time;
    
    return this;
  }

  get ID() {
    return this.id;
  }

  get donorId() {
    return this.donar.id;
  }

  get transactionId() {
    return this.transaction_id;
  }
  get receiptId() {
    return this.receipt_id;
  }

  get teleCallerId() {
    return this.telecaller;
  }

  get amountValue() {
    return this.amount;
  }

  get chequeNumber() {
    return this.cheque_number;
  }

  get screenshotUrl() {
    return this.screenshot_url;
  }

  get provisionDetails() {
    return this.provision;
  }

  get modeOfTransaction() {
    return this.mode_of_transaction;
  }

  get createdAt() {
    return new Date(this.created_at).toLocaleString();
  }

  get is80GForm() {
    return this.is_80g;
  }

  get branchDetail() {
    return this.branch;
  }

  get updatedAt() {
    return new Date(this.updated_at).toLocaleString();
  }

  get teleCallerAtcId() {
    if (this.telecaller.atcProfile) return this.telecaller.atcProfile.atcId;
    return null;
  }

  get status() {
    if([14,15,16,17,18].indexOf(+this.modeOfTransaction) != -1){
      switch (this._status) {
        case 0:
          return "Requested";
        case 1:
          return "Agent assigned";
        case 2:
          return "Broken";
        case 3:
          return "Completed";
        case 4:
          return "Receipt Sent";
      }
    }
    switch (this._status) {
      case 0:
        return "Donation Created";
      case 1:
        return "Yet to be verified";
      case 2:
        return "Not verified";
      case 3:
        return "Verified";
      case 4:
        return "Receipt Sent";
    }
  }

  // get statusCode() {
  //   return this._status;
  // }
}
