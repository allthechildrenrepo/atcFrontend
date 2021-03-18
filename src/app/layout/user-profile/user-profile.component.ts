import { Component, OnInit } from "@angular/core";
import { whatsAppGetQR, whatsAppGetStatus } from "src/app/shared/services/whatsapp.service";

import { User } from "../../shared/model/user";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"],
})
export class UserProfileComponent implements OnInit {
  localValue: User;
  whatsappConnected: boolean = false;
  checkingStatus: boolean = true;
  whatsappQRCodeImage: string;
  constructor(
    public whatsAppStatus: whatsAppGetStatus,
    public whatsappQRCode: whatsAppGetQR) {}

  ngOnInit() {
    this.localValue = new User().deSerialize(
      JSON.parse(localStorage.getItem("user"))
    );
    this.checkWhatsappStatus();
  }

  checkWhatsappStatus() {
    this.checkingStatus = true;
    this.whatsappConnected = false;
    this.whatsAppStatus.get().subscribe((response) => {
      if (response.accountStatus == "authenticated"){
        this.checkingStatus = false;
        this.whatsappConnected = true;
        return;
      }
      this.whatsappConnected = false;
      this.whatsappQRCodeImage = response.qrCode;
      this.checkingStatus = false;
    },(err) => {
      this.whatsappConnected = false;
      this.checkingStatus = false;
    });
  }

  getQrCode() {
    this.whatsappQRCode.get().subscribe((res) => {
      
    })
  }
  dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
  for (var i = 0; i < binary.length; i++) {
     array.push(binary.charCodeAt(i));
  }
 return new Blob([new Uint8Array(array)], {
    type: 'image/jpg'
});
}

}
