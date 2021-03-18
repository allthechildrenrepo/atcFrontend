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