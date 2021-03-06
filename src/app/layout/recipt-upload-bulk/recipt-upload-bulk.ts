import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { MatDialog, MatSnackBar } from "@angular/material";
import { WhatsAppTransaction } from "src/app/shared/model";
import { WhatsappDeleteService } from "src/app/shared/services/whatsapp-bulk-download.service";
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
  dataSource;
  selectedBranchName: string;
  selectedBranch: number;
  currentPage: number = 0;
  previouspageUrl: string;
  nextPageUrl: string;
  currentPageURL: string;
  deleteList: number[] = [];


  constructor(
    public leadUpdateService: ReceiptBulkUpdateService,
    public whatsAppTransactionService: WhatsAppTransactionServiceV2,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public whatsappDeleteService: WhatsappDeleteService
  ) {
    super(dialog, snackBar);
  }

  ngOnInit() {
    // this.fetchWhatsAppTransaction()
  }

  ngAfterViewInit() {
    if (this.file) {
      this.file.nativeElement.value = null;
      this.fileToUpload = null;
    }
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

  fetchWhatsAppTransaction(url = null) {
    this.presentLoader();
    //If the user is not an Admin, Restrict another branch WhatsApp transaction details.
    // if(this.selectedBranch != 17) {
    //     param['branch_id'] = this.selectedBranch;
    // }
    let param = { 'status': 0, 'branch_id': this.selectedBranch }
    this.transaction = [];
    if (!url) {
      url = this.whatsAppTransactionService.endpointsss;
    }
    this.whatsAppTransactionService.getwithURL(url, param).subscribe((data) => {
      this.currentPageURL = url
      this.previouspageUrl = data.previous;
      this.nextPageUrl = data.next;
      data.results.forEach(element => {
        this.transaction.push(new WhatsAppTransaction().deserializer(element));
      });
      this.dataSource = this.transaction;
      this.dismissLoader();
    }, err => {
      this.somethingWentWrong();
      this.dismissLoader();
    })
  }

  refreshParent() {
    this.fetchWhatsAppTransaction(this.currentPageURL);
  }

  setBranch(branch) {
    this.selectedBranch = branch.branchId;
    this.selectedBranchName = branch.branchName;
    this.fetchWhatsAppTransaction();
  }

  removeBranch() {
    this.selectedBranch = null;
    this.selectedBranchName = null;
    this.transaction = [];
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
    const param = this.leadUpdateService.getParams(this.fileToUpload, this.selectedBranch);
    this.leadUpdateService.postMultiPardData(param).subscribe(
      res => {
        this.dismissLoader()
        let type = res.status ? 'success' : 'failure'
        this.showNotification("bottom", "center", type, "", res.message)
        if(res.status){
          this.refreshParent();
        }
        this.resetFile();
      },
      err => {
        this.somethingWentWrong();
        this.resetFile();
      }
    );
  }

  showPreviousPage() {
    this.fetchWhatsAppTransaction(this.previouspageUrl);
    this.currentPage = this.currentPage - 1;
  }

  showNextPage() {
    this.fetchWhatsAppTransaction(this.nextPageUrl);
    this.currentPage = this.currentPage + 1;
  }



  checkboxselectedEvent(event) {
    const eventData: WhatsAppTransaction = event.data;
    if (event.checked) this.deleteList.push(eventData.id);
    else {
      const index: number = this.deleteList.indexOf(eventData.id);
      this.deleteList.splice(index, 1);
    }
    this.deleteList = [...new Set(this.deleteList)];
  }

  deleteReceipt(){
    let params = { 'transaction_ids': this.deleteList};
    debugger;
    this.presentLoader()
    this.whatsappDeleteService.post(params).subscribe((data) => {
      this.dismissLoader()
      let type = data.status ? 'success' : 'failure'
      this.showNotification("bottom", "center", type, "", data.message)
      if(data.status){
        this.refreshParent();
      }
    })
    
  }

}
