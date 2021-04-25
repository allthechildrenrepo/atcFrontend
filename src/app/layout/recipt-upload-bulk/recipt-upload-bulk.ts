import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { MatDialog, MatSnackBar } from "@angular/material";
import { WhatsAppTransaction } from "src/app/shared/model";
import { WhatsAppTransactionService, WhatsAppTransactionServiceV2 } from "src/app/shared/services/whatsapp-transaction.service";
import { LeadUpdateService, ReceiptBulkUpdateService } from '../../shared/services/leads';
import { BasePage } from "../../utils";

@Component({
  selector: "app-recipt-upload",
  templateUrl: "./recipt-upload-bulk.html",
  styleUrls: ["./recipt-upload-bulk.scss"]
})
export class ReciptUploadComponent extends BasePage implements AfterViewInit {

  @ViewChild('file', { static: false }) file;
  public fileToUpload: File = null;
  // TO display mat progressbar during upload
  fileUploading = false;
  public alerts: Array<any> = [];
  transaction: WhatsAppTransaction[] = [];
  dataSource

  constructor(
    public leadUpdateService: ReceiptBulkUpdateService,
    public whatsAppTransactionService: WhatsAppTransactionServiceV2,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    super(dialog, snackBar);
  }

  ngOnInit(){
    this.fetchWhatsAppTransaction()
  }

  ngAfterViewInit() {
    this.file.nativeElement.value = null;
    this.fileToUpload = null;
  }

  addFiles() {
    this.file.nativeElement.click();
  }

  /**
   * Rest the file by removing the file input element value
   */
  resetFile() {
    this.file.nativeElement.value = null;
    this.fileUploading = false;
  }

  /**
   * Check the files type is csv or not
   * If csv file then ready to upload
   * if not a csv file throw error notification
   */
  onFilesAdded() {
    this.alerts = [];
    const files: { [key: string]: File } = this.file.nativeElement.files;
    if (files[0].size / (1000 * 1000) > 15) {
      this.alerts.push({
        id: 1,
        type: "danger",
        message: `File not uploaded. File size must be less than 15 MB.`
      });
      return
    }
    this.fileToUpload = files[0];
  }

  fetchWhatsAppTransaction() {
    this.presentLoader();

    //If the user is not an Admin, Restrict another branch WhatsApp transaction details.
    // if(this.selectedBranch != 17) {
    //     param['branch_id'] = this.selectedBranch;
    // }
    let param = { 'status':0}

    this.transaction = [];
    this.whatsAppTransactionService.get(param).subscribe((data) => {
        data.forEach(element => {
            this.transaction.push(new WhatsAppTransaction().deserializer(element));
        });
        this.dataSource = this.transaction;
        this.dismissLoader();
    }, err => {
        this.somethingWentWrong();
        this.dismissLoader();
    })
}


  /**removes the files after it added */
  removeFile() {
    this.fileToUpload = null;
    this.file.nativeElement.value = null;
  }
  /**
   * uploads the file to server
   * and response Generic server response
   */
  uploadFileToServer() {
    this.fileUploading = true;
    const param = this.leadUpdateService.getParams(this.fileToUpload);
    this.leadUpdateService.postMultiPardData(param).subscribe(
      res => {
        if (res.status) {
          this.showNotification(
            "bottom",
            "center",
            "success",
            "info-circle",
            this.fileToUpload.name + " Uploaded Successfully"
          );
          this.fileToUpload = null;
        } else {
          this.showNotification(
            "bottom",
            "center",
            "danger",
            "info-circle",
            this.fileToUpload.name + " not Uploaded, please check the file"
          );
        }
        this.resetFile();
      },
      err => {
        this.somethingWentWrong();
        this.resetFile();
      }
    );
  }
}
