import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class EndPoint {
  // public serverUrl = "http://localhost:8000/";
  public serverUrl = "https://api2.allthechildren.in:8000/";

  // allthechildren397@gmail.com
  public whatsApp = "https://eu116.chat-api.com/instance140321/"
  public whatsappToken = "?token=9bcosyhec2nuj1hy"

  // allthechildren397@gmail.com - pickup instance
  public pickupWhatsApp = "https://eu158.chat-api.com/instance162993/"
  public pickupWhatsappToken = "?token=146pyq3pqsztck04";

  public wassengerUrl = "https://api.wassenger.com/v1/files/";


  get login() {
    return this.serverUrl + "atc/login/";
  }

  get fetchDonorDetatils() {
    return this.serverUrl + "atc/donars/";
  }

  get sendRecipt() {
    return this.serverUrl + "atc/ack/";
  }

  get submitDonation() {
    return this.serverUrl + "atc/donation/";
  }

  get donationApprove() {
    return this.serverUrl + "atc/donation/";
  }

  get fetchDonationTransaction() {
    return this.serverUrl + "atc/fetch_donation/";
  }

  get fetchAllBranch() {
    return this.serverUrl + "atc/branch/";
  }

  get modesOfTransaction() {
    return this.serverUrl + "atc/modes/";
  }

  get createTeleCaller() {
    return this.serverUrl + "atc/telecaller_profile/";
  }

  get fetchTeleCaller() {
    return this.serverUrl + "atc/telecallers/";
  }

  get editDonor() {
    return this.serverUrl + "atc/profile/";
  }

  get batch() {
    return this.serverUrl + "atc/batch/";
  }

  get teleCallerStat() {
    return this.serverUrl + "atc/stat/";
  }

  get whatsappSendMSG() {
    return this.whatsApp + "sendMessage" + this.whatsappToken;
  }

  get whatsappSendFile() {
    return this.whatsApp + "sendFile" + this.whatsappToken;
  }

  get whatsappStatus() {
    return this.whatsApp + "status" + this.whatsappToken;
  }

  get whatsappQRCode() {
    return this.whatsApp + "qr_code" + this.whatsappToken;
  }

  get Leadrequest() {
    return this.serverUrl + "atc/leads/";
  }

  get LeadBulkUpdate() {
    return this.serverUrl + "atc/leads/bulk_update/";
  }

  get leadBatch() {
    return this.serverUrl + "atc/lead_batch";
  }

  get updateTelecallerToLead() {
    return this.serverUrl + "atc/base_upload/";
  }

  get uploadBulkReciptXls() {
    return this.serverUrl + "receipt/receipt_upload/";
  }

  get raiseLeadRequest() {
    return this.serverUrl + "atc/lead_req/";
  }

  get approveLeadRequest() {
    return this.serverUrl+ "atc/lead_req/";
  }

  get whatsappLogout() {
    return this.whatsApp+"logout"+this.whatsappToken;
  }

  get whatsappNumberCheck() {
    return this.whatsApp+"checkPhone"+this.whatsappToken;
  }

  get whatsappTransaction() {
    return this.serverUrl + "atc/receipt_trans/";
  }

  get whatsappTransactionFetch() {
    return this.serverUrl + "receipt/fetch/";

  }

  get pickUpWhatsAppSendMessage() {
    return this.whatsApp+"sendMessage"+this.whatsappToken;
  }

  get wassanggerDeviceList() {
    return this.serverUrl+"/atc/wass_devices/"
  }

  get filesInWassangger() {
    return this.serverUrl+"/atc/wass_files/"
  }

  get promotion() {
    return this.serverUrl+"/atc/promotion/"
  }

  get promotionImage() {
    return this.wassengerUrl;
    // 5f8d1d8e42c8c0987a692c7d/download
    // https://api.wassenger.com/v1/files/5f8d1d8e42c8c0987a692c7d/download
  }
}
