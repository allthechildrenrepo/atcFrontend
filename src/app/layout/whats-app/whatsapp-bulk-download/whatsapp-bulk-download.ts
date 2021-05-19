import { Component, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";
import { DateFormaterService } from "src/app/shared/services/date.service";
import { WhatsappBulkDownloadService } from "src/app/shared/services/whatsapp-bulk-download.service";
import { BasePage } from "src/app/utils";

@Component({
    selector: "whatsapp-bulkdownload-dialog",
    templateUrl: "whatsapp-bulk-download.html",
    styleUrls: ["./whatsapp-bulk-download.scss"]
})
export class WhatsappTransactionBulkDownloadDialog extends BasePage {

    fromDate: any;
    toDate: any;
    minDate: any;
    email: string;
    lastSearched: any;
    branch: any;

    constructor(
        public dialogRef: MatDialogRef<WhatsappTransactionBulkDownloadDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        public bulkDownloadService: WhatsappBulkDownloadService,
        public dateFormaterService: DateFormaterService
    ) {
        super(dialog, snackBar);
        this.branch = data.branch
        this.resetDateFilter();
    }

    setFromDate(dateEvent) {
        this.minDate = new Date(dateEvent.targetElement.value);
        this.fromDate = new Date(dateEvent.targetElement.value);
      }
    
      setToDate(dateEvent) {
        this.toDate = new Date(dateEvent.targetElement.value);
      }
    
      resetDateFilter() {
        this.fromDate = undefined;
        this.toDate = undefined;
      }

    setDateFilter(date) {
        this.fromDate = date.fromDate;
        this.toDate = date.toDate;
        this.postDownloadRequest();
    }

    postDownloadRequest() {
        let params = {
            "from_date": this.fromDate,
            "end_date": this.toDate,
        }
        this.dialogRef.close(params)
    }

    emitDate() {
        this.presentLoader();
        var tomorrow = new Date();
        tomorrow.setDate(new Date(this.toDate).getDate()+1);
        let params = { 'from_date': this.dateFormaterService.converDateToYmd(this.fromDate), 
                       'end_date': this.dateFormaterService.converDateToYmd(this.toDate), 
                       tomorrow: this.dateFormaterService.converDateToYmd(tomorrow), 
                       'to_email': this.email.split(","),
                       "branch_id": this.branch
                     }
                     debugger;
        this.bulkDownloadService.post(params).subscribe((data) => {
            this.dismissLoader()
            let type = data.status ? 'success' : 'failure'
            this.showNotification("bottom", "center", type, "", data.message)
            this.dialogRef.close()
        })
      }
}