import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar } from "@angular/material";
import htmlToImage from "html-to-image";
import * as jspdf from "jspdf";
import { User } from '../../shared/model';
import { WhatsAppTransactionService } from '../../shared/services/whatsapp-transaction.service';
import { whatsAppSendFileService, WhatsAppCheckNumber } from '../../shared/services/whatsapp.service';
import { BasePage } from '../../utils';
import { ReceiptSendMailService } from '../../shared/services/receipt.service';


@Component({
  selector: "app-recipt-download",
  templateUrl: "./recipt-download.component.html",
  styleUrls: ["./recipt-download.component.scss"]
})
export class ReciptDownloadComponent extends BasePage implements OnInit {

  pdf: any;
  whatsapp_id: string = null;
  sendTo: string = null;
  isTrackDone: boolean = false;
  dismissPopUp: boolean = false;
  currentDate = new Date();
  user: User;
  fileName: string;
  canvas: any;
  enableButton: boolean = false;
  notAWhatsappNumber: boolean = false;
  imageCounter = 0;

  constructor(
    public whatsAppTransactionService: WhatsAppTransactionService,
    public dialogRef: MatDialogRef<ReciptDownloadComponent>,
    public sendWhatsapp: whatsAppSendFileService,
    public whatsAppNumberCheck: WhatsAppCheckNumber,
    public receiptSendMailService: ReceiptSendMailService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {
    super(dialog, snackBar);
  }

  ngOnInit() {
    this.user = new User().deSerialize(JSON.parse(localStorage.getItem('user')));
    this.checkWhatsappNumber();
  }

  ngAfterViewInit() {
    this.convertHtmlToPDF();
  }

  /**
   * Convert the html to pdf and send to whatsapp, or just download or go for print
   */
  convertHtmlToPDF() {
    if (this.imageCounter < 2) {
      return;
    }
    this.presentLoader();
    this.fileName = this.data.reciptId + '-' + this.data.mobile + '.pdf';
    htmlToImage
      .toCanvas(document.getElementById("receipt"), { quality: 1 })
      .then((canvas) => {
        this.canvas = canvas;
        document.body.appendChild(canvas);
        var imgWidth = 100;
        var pageHeight = 195;
        var imgHeight = ((canvas.height * imgWidth) / canvas.width) - 2;
        var heightLeft = imgHeight;

        const contentDataURL = canvas.toDataURL("image/png");
        // a4': [595.28, 841.89]
        this.pdf = new jspdf("p", "mm", [300, 350], false); // A4 size page of PDF
        var position = 0;
        this.pdf.addImage(contentDataURL, "PNG", 2, 2, imgWidth, imgHeight, '', 'SLOW');
        this.enableButton = true;
        this.dismissLoader();
      })
  }


  convertURIToImageData(URI) {
    return new Promise(function (resolve, reject) {
      if (URI == null) return reject();
      var canvas = document.createElement("canvas"),
        context = canvas.getContext("2d"),
        image = new Image();
      image.addEventListener(
        "load",
        function () {
          canvas.width = image.width;
          canvas.height = image.height;
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(context.getImageData(0, 0, canvas.width, canvas.height));
        },
        false
      );
      image.src = URI;
    });
  }

  closeReceipt() {
    if (this.isTrackDone == false) {
      this.optionsAlert(
        "No Actions done! ",
        "'YES' - receipt will be downloaded and tracked ,  'NO' - close without any action",
        (data) => {
          if (data) {
            this.downloadPdf();
            this.dismissPopUp = true;
          } else {
            document.body.removeChild(this.canvas);
            this.pdf = undefined;
            this.dialogRef.close();
          }
        }
      )
    } else {
      this.pdf = undefined;
      this.dialogRef.close();
    }
  }
  checkWhatsappNumber() {

    let phone = this.data.mobile;
    phone = "91" + this.data.mobile;
    this.whatsAppNumberCheck.get({ 'phone': phone }).subscribe((resp) => {
      if (resp.result == 'not exists') {
        this.dismissLoader();
        this.notAWhatsappNumber = true;
        return;
      }
    })
  }
  /**
   * set the download and print page false and whatsappto true
   */
  sentViaWhatsAPP() {
    let phone = this.data.mobile;
    phone = "91" + this.data.mobile;
    this.sendTo = phone;
    if (this.data.mobile.length === 10) {
      this.storeReceiptTrans(0);
      document.body.removeChild(this.canvas);
    } else {
      alert("Message not sent,Donar number is not valid, It must be 10 digit length");
      document.body.removeChild(this.canvas);
      return;
    }
  }

  /**
  * set the onlyDownload to false and print page true and whatsappto false
  */
  openPdfInPrintPage() {
    let phone = this.data.mobile;
    phone = "91" + this.data.mobile;
    let url = this.pdf.output('bloburl')
    window.open(url, '_blank');
    this.pdf.save(this.fileName);
    this.sendTo = phone
    document.body.removeChild(this.canvas);
    this.storeReceiptTrans(2);
  }

  /**
  * set the download to true  and print page false and whatsappto false
  */
  downloadPdf() {
    let phone = this.data.mobile;
    phone = "91" + this.data.mobile;
    this.pdf.save(this.fileName);
    this.sendTo = phone
    this.dismissLoader()
    document.body.removeChild(this.canvas);
    this.storeReceiptTrans(2);
  }

  signImageLoaded() {
    this.imageCounter++;
    this.convertHtmlToPDF();
    console.log("sign loaded")
  }


  logImageLoaded() {
    this.imageCounter++;
    this.convertHtmlToPDF();
    console.log("logo loaded")
  }

  /**
   * send email set mail as true and send 
   */
  sendEmail() {
    var file = this.pdf.output('datauristring');
    let params = {
      ack: file.split('data:application/pdf;filename=generated.pdf;base64,')[1],
      to: this.data.email,
      telecaller: this.user.userid,
      receipt_id: this.data.reciptId,
      whatsapp_number: this.data.email,
      whatsapp_id: this.data.email,
      donation_id: this.data.donationId,
      message: "Hi thanks for the donation",
      branch_id: this.data.donatedBranch,
    };
    let otherPrams = this.generateParams();
    params = { ...params, ...otherPrams };

    this.receiptSendMailService.post(params).subscribe((data) => {
      this.dismissLoader();
      document.body.removeChild(this.canvas);
      this.isTrackDone = true;
      return;
    }, (err) => {
      this.somethingWentWrong();
      this.dismissLoader();
      return;
    })
  }

  generateParams() {
    return {
      'reciptId': this.data.reciptId,
      'donated_date': this.data.donatedDate,
      'name': this.data.name,
      'phone1': this.sendTo,
      'phone2': this.data.phone2,
      'amount': this.data.amount,
      'amount_in_words': this.data.amountWords,
      'bank_transaction_id': this.data.transaction,
      'cheque_number': this.data.transaction,
      'is_80g': this.data.is80G,
      'bank': this.data.bank,
      'bank_branch': this.data.branch,
      'address_line_1': this.data.address,
      'address_line_2': this.data.address1,
      'pincode': this.data.pincode,
      'email': this.data.email,
      'donatedBranch': this.data.donatedBranch,
      'foreign_number': this.data.foreignNumber,
      'payment_mode': this.data.payment_mode,
    }
  }

  /**
   * @param medium:
   * WHATSAPP = 0
   * EMAIL = 1
   * MANUAL = 2
   * **/
  storeReceiptTrans(medium) {
    this.presentLoader();
    var file = this.pdf.output('datauristring');
    let params = {
      receipt_id: this.data.reciptId,
      ack: file.split('data:application/pdf;filename=generated.pdf;base64,')[1],
      whatsapp_number: this.sendTo,
      telecaller_id: this.user.userid,
      branch_id: this.data.donatedBranch,
      medium: medium
    };
    if (this.data.donationId && this.data.donationId != "") {
      params['donation_id'] = this.data.donationId;
    }
    let otherPrams = this.generateParams();
    params = { ...params, ...otherPrams };
    this.whatsAppTransactionService.post(params).subscribe((data) => {
      this.isTrackDone = true;
      this.dismissLoader();
      this.dismissPopUp ? this.closeReceipt() : "";
    }, (err) => {
      this.somethingWentWrong();
      this.dismissLoader();
    })
  }

}
