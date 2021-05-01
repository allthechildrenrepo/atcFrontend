import {
  Component,
  Input,
  OnInit,
  Output,
  Inject,
  EventEmitter
} from "@angular/core";
import { DonationTransaction } from "../../shared/model/donation-transaction";
import {
  MatTableDataSource,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBar
} from "@angular/material";
import { TransactionModeService } from "../../shared/services/transaction-mode.service";
import { Branch } from "../../shared/model/branch";
import { DonationApproveService } from "../../shared/services/donation-approve.service";
import { EditDonorTransactonComponent } from "../edit-donor-transacton/edit-donor-transacton.component";
import { ReciptDownloadComponent } from "../recipt-download/recipt-download.component";
import { TableUtil } from "../../shared/TableUtil";
import { ImageDialogComponent } from "../image-dialog/image-dialog.component";
import { BatchService } from '../../shared/services/batch.service';
import { Batch } from '../../shared/model/batch';
import { BasePage } from 'src/app/utils/pages/base/base.component';
import { User } from 'src/app/shared/model';
import { TransactionReceiptDetailsComponent } from '../transaction-receipt-details/transaction-receipt-details.component';
import { PreviousTransactionComponent } from '../previous-transaction/previous-transaction.component';
import { SelectionModel } from '@angular/cdk/collections';
import { ReciptFormComponent } from '../recipt-form/recipt-form.component';

@Component({
  selector: "app-donar-transaction-details",
  templateUrl: "./donar-transaction-details.component.html",
  styleUrls: ["./donar-transaction-details.component.scss"]
})
export class DonarTransactionDetailsComponent extends BasePage implements OnInit {
  @Input() tableData: DonationTransaction[];
  @Input() batch: Batch = new Batch();
  @Input() batchListLength;
  @Output() assignPickupAgent = new EventEmitter<any>();
  @Output() pickUpconfirmPopUp = new EventEmitter<any>();
  timeLeftInterval;

  transactionsDataSource: MatTableDataSource<DonationTransaction>;
  selection = new SelectionModel<DonationTransaction>(true, []);
  modeOfTransaction: any[] = [];
  user: User;


  @Input() columnsToDisplay: string[] = [
    "reciptId",
    "mode",
    "transactionId",
    "amount",
    "branch",
    "status",
    "telecallerId",
    "voiceCallingName",
    "telecallerName",
    "donatedDate",
    "generateReceipt"
  ];

  @Input() columnToDownload = [
    "donatedDate",
    "name",
    "number",
    "phone1",
    "amount",
    "transactionId",
    "mode",
    "telecallerId",
    "voiceCallingName",
    "branch",
    "donorType",
    "remarks"
  ]

  @Output() checkboxEvent = new EventEmitter();
  @Output() refresh = new EventEmitter();

  constructor(
    public batchService: BatchService,
    public transactionModeService: TransactionModeService,
    public dialog: MatDialog,
    public donationApproveService: DonationApproveService,
    public snackBar: MatSnackBar
  ) {
    super(dialog, snackBar);
  }

  ngOnInit() {
    if (this.tableData) {
      this.transactionsDataSource = new MatTableDataSource(this.tableData);
    }
    this.fetchModeOfTransaction();
    if (this.columnsToDisplay.indexOf('pickupTime') > -1) {
      this.timeLeftInterval = setInterval(() => {
        this.calculateTimeLeft();
      }, 1000);
      this.sortDataSource();
    }

  }

  ngOnChanges() {
    if (this.tableData) {
      this.transactionsDataSource = new MatTableDataSource(this.tableData);
    }
  }

  fetchModeOfTransaction() {
    this.presentLoader();

    this.transactionModeService.get().subscribe(
      data => {
        this.dismissLoader();
        this.modeOfTransaction = data.results;
      },
      err => {
        this.dismissLoader();
        this.somethingWentWrong();
      }
    );
    this.dismissLoader();
  }

  getModeOfTransaction(id) {
    let mode = this.modeOfTransaction.filter(
      tansactionMode => tansactionMode.id == id
    );
    if (mode.length > 0) return mode[0].name;
    return "NULL";
  }

  checkBoxEvent(event, tableData) {
    const emitValue = { checked: event.checked, data: tableData };
    this.checkboxEvent.emit(emitValue);
    event ? this.selection.toggle(tableData) : null;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.transactionsDataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(event) {
    this.isAllSelected() ?
      this.selection.clear() :
      this.transactionsDataSource.data.forEach(
        row => {
          this.selection.select(row);
          const emitValue = { checked: event.checked, data: row };
          this.checkboxEvent.emit(emitValue);
        });
    if (!event.checked) {
      this.transactionsDataSource.data.forEach(
        row => {
          const emitValue = { checked: event.checked, data: row };
          this.checkboxEvent.emit(emitValue);
        });
    }
  }

  editTransactionDetails(donarTransactionDetails) {
    const dialogRef = this.dialog.open(EditDonorTransactonComponent, {
      width: "50vw",
      autoFocus: false,
      maxHeight: "90vh",
      data: { transactionDetails: donarTransactionDetails, reciptDetails: false, editDonorDetails: false }
    });

    dialogRef.afterClosed().subscribe((refresh: boolean) => {

      if (refresh) {
        this.refresh.emit();
      }
    });
  }

  isValidData(data) {
    if (data && data != 'null') {
      return data;
    }
    return '-';
  }

  deleteTransactionDetails(donationTransaction) {
    const formData = new FormData();
    this.donationApproveService.donationId = donationTransaction.id;
    formData.append("status", "5");
    this.donationApproveService.put(formData).subscribe(
      response => {
        this.batchService.batchId = undefined;
        if (response.status) {
          donationTransaction._status = 5;
          this.refresh.emit();
        }
      },
      err => {
        this.batchService.batchId = undefined;
      }
    );
  }

  generateReceipt(donationTransaction) {
    const dialogRef = this.dialog.open(ReciptFormComponent, {
      width: "120vw",
      autoFocus: false,
      maxHeight: "90vh",
      data: { transactionDetails: donationTransaction, reciptDetails: true, showReciptForm: true }
    });

    dialogRef.afterClosed().subscribe(res => {
      // this.showReceipt(res);
    });
  }

  openDetails(donationTransaction) {
    let modeOfTransaction = this.getModeOfTransaction(donationTransaction.mode_of_transaction);

    const dialogRef = this.dialog.open(TransactionReceiptDetailsComponent, {
      width: "120vw",
      autoFocus: false,
      maxHeight: "90vh",
      data: { transactionDetails: donationTransaction, modeOfTransaction: modeOfTransaction }
    });

    dialogRef.afterClosed().subscribe(res => {
      // this.showReceipt(res);
    });
  }

  downloadTable(tableId) {
    TableUtil.exportToExcel(tableId, "donation-transaction");
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.transactionsDataSource.filter = filterValue.trim().toLowerCase();
  }

  openScreenshot(imgSrc) {
    const dialogRef = this.dialog.open(ImageDialogComponent, {
      width: "1000vw",
      autoFocus: false,
      maxHeight: "90vh",
      data: imgSrc
    });

    dialogRef.afterClosed().subscribe(res => {
    });
  }

  openPastTransactions(donarTransactionDetails) {
    const dialogRef = this.dialog.open(PreviousTransactionComponent, {
      width: "100vw",
      autoFocus: false,
      maxHeight: "90vh",
      data: { transactionDetails: donarTransactionDetails, transactionModes: this.modeOfTransaction }
    });

    dialogRef.afterClosed().subscribe((data: verification) => {
      if (data.verify) {
        this.verifyTransaction(donarTransactionDetails);
      }
      if (data.notVerify) {
        this.notVerified(donarTransactionDetails);
      }
    });
  }

  verifyTransaction(donationTransaction) {
    this.presentLoader();
    donationTransaction.sign = true;
    this.donationApproveService.donationId = donationTransaction.id;
    this.user = new User().deSerialize(
      JSON.parse(localStorage.getItem("user"))
    );
    const formData = new FormData();
    formData.append("is_verified", "true");
    formData.append("approved_by", this.user.id + "");
    formData.append("status", "3");
    if (donationTransaction.is80GForm) {
      formData.append("is_80g", 'true');
    }
    this.donationApproveService.put(formData).subscribe(
      response => {
        this.dismissLoader();
        if (response.status) {
          donationTransaction.sign = false;
          donationTransaction._status = 3;
          // donationTransaction.is_verified = true;
          // this.refresh.emit();
        }
      },
      err => {
        this.dismissLoader();
        this.somethingWentWrong();
      }
    );
    this.dismissLoader();
  }

  notVerified(donationTransaction: DonationTransaction) {
    const formData = new FormData();
    let dialogRef = this.dialog.open(RemarksDialog, { width: "500px" });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.donationApproveService.donationId = donationTransaction.id;
        formData.append("status", "2");
        // result = result ? result : "No reason given by verifier";
        formData.append("remarks", result);
        this.donationApproveService.put(formData).subscribe(
          response => {
            this.batchService.batchId = undefined;
            if (response.status) {
              donationTransaction._status = 2;
              donationTransaction.remarks = result;
              // this.transactionsDataSource.statusCode = 2;
              // this.refresh.emit(); - removed
            }
          },
          err => {
            this.batchService.batchId = undefined;
          }
        );
      }
    });
  }

  assignAgent(data, status) {
    let emitData = { tableData: data, status: status };
    this.assignPickupAgent.emit(emitData)
  }

  confirmPopUp(data, status) {
    let emitData = { tableData: data, status: status };

    this.pickUpconfirmPopUp.emit(emitData)
  }

  calculateTimeLeft(pickupDate?, pickupTime?) {
    if (pickupDate && pickupTime) {
      var countDownDate = new Date(pickupDate + " " + pickupTime).getTime();
      var now = new Date().getTime();
      var distance = countDownDate - now;

      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (days >= 0 && hours >= 0 && minutes >= 0) {
        return days + "D " + hours + "H " + minutes + "M " + seconds + "S";
      }

      else if (days < 0 || hours < 0 || minutes < 0) {  
        return "OverTime " + (-days) + "D " + (-hours) + "H " + (-minutes) + "M " + (-seconds) + "S";
      }

      else {
        return "";
      }
    }
  }

  convertFrom24To12Format(pickupTime) {
    console.log("Test", pickupTime)
    if (pickupTime.match(/([0-9]{1,2}):([0-9]{2})/)) {
      const [sHours, minutes] = pickupTime.match(/([0-9]{1,2}):([0-9]{2})/).slice(1);
      const period = +sHours < 12 ? 'AM' : 'PM';
      const hours = +sHours % 12 || 12;
      return `${hours}:${minutes} ${period}`;
    }
    else {
      return pickupTime;
    }
  }

  sortDataSource() {
    this.transactionsDataSource.data.sort((a: any, b: any) => {
      if (new Date(a.donated_date + " " + a.pickup_time).getTime() < new Date(b.donated_date + " " + b.pickup_time).getTime()) {
        return 1;
      } else if (new Date(a.donated_date + " " + a.pickup_time).getTime() > new Date(b.donated_date + " " + b.pickup_time).getTime()) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  getAddressForPickUp(tableData: DonationTransaction) {
    if (tableData.pickup_address) {
      return tableData.pickup_address;
    } else {
      return tableData.donar.userProfile.addressLine1 + "," + tableData.donar.userProfile.addressLine2;
    }
  }

  ngOnDestroy() {
    clearInterval(this.timeLeftInterval);
  }
}

@Component({
  selector: "dialog-overview-example-dialog",
  templateUrl: "remarks-popup.html"
})
export class RemarksDialog {
  remarks: any;
  constructor(
    public dialogRef: MatDialogRef<RemarksDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  submit() {
    this.dialogRef.close(this.remarks);
  }
}

export interface verification {
  notVerify: boolean, verify: boolean
}
