import { AtcUser } from ".";
import { DonationTransaction } from './donation-transaction';
import { Branch } from 'src/app/shared/model/branch';

export class WhatsAppTransaction {
    public telecaller: AtcUser;
    public whatsapp_id: string;
    public donation: DonationTransaction;
    private receipt_id: string;
    private whatsapp_number: string;
    private created_date: Date;
    private image_base64: string;
    public reciptUrl: string;
    public branch: Branch;
    private _medium: number;
    public donatedDate: string;
    public name: string;
    public mobile: string;
    public phone2: string ;
    public amount: string;
    public amountWords: string
    public transaction: string
    public is80G: boolean 
    public bank: string 
    public bankBranch: string;
    public address: string 
    public address1: string 
    public pincode: string 
    public email: string 
    public donatedBranch: Branch
    public foreignNumber: string 


    deserializer(input) {
        if (input.telecaller) {
            this.telecaller = new AtcUser().deserialize(input.telecaller);
        }
        this.whatsapp_number = input.whatsapp_number;
        this.whatsapp_id = input.whatsapp_id;
        if(input.donation){
            this.donation = new DonationTransaction().deserialize(input.donation);
        }
        this.created_date = input.created_at;
        this.image_base64 = input.image_base64;
        this.receipt_id = input.receipt_id;
        this._medium = input.medium;
        this.reciptUrl = input.receipt;
        this.donatedDate = input.donated_date;
        this.name = input.name;
        this.phone2 = input.phone2;
        this.mobile = input.whatsapp_number;
        this.is80G = input.is_80g;
        this.address = input.address_line_1;
        this.address1 = input.address_line_2;
        this.pincode = input.pincode;
        this.email = input.to_email;
        this.donatedBranch = new Branch().deserialize(input.branch);

        this.foreignNumber = input.foreign_number;
        this.amount = input.amount;
        this.amountWords = input.amount_in_words;
        this.bank = input.bank;
        this.bankBranch = input.bank_branch;
        this.transaction = input.bank_transaction_id;



        if(input.branch) {
            this.branch = new Branch().deserialize(input.branch);
        }
        return this;
    }

    get receiptId() {
        return this.receipt_id;
    }

    get sendPdf() {
        return this.image_base64;
    }

    get imageBase64() {
        return this.image_base64;
    }

    get sendDate() {
        return this.created_date;
    }

    get whatsAPPId() {
        return this.whatsapp_id;
    }

    get whatsAppNumber() {
        return this.whatsapp_number;
    }

    get sendUser() {
        return this.telecaller;
    }

    get medium(){
        if(this._medium == 0) {
            return "WhatsApp";
        }
        if(this._medium == 1 ) {
            return "Email";
        }
        if(this._medium == 2) {
            return "Downloaded"
        }
    }
}