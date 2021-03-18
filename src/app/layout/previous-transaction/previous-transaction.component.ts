import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatSnackBar } from '@angular/material';
import { DonationTransaction } from 'src/app/shared/model/donation-transaction';
import { FetchDonationTransactionService } from 'src/app/shared/services/fetch-donation-transaction.service';
import { BasePage } from 'src/app/utils';
import { DateFormaterService } from 'src/app/shared/services/date.service';
import { verification } from '../donar-transaction-details/donar-transaction-details.component';

@Component({
  selector: 'app-previous-transaction',
  templateUrl: './previous-transaction.component.html',
  styleUrls: ['./previous-transaction.component.scss']
})
export class PreviousTransactionComponent extends BasePage implements OnInit {

  currentTransaction;
  pastTransaction: DonationTransaction[] = [];
  modeOfTransaction;

  dataSource: MatTableDataSource<DonationTransaction>;

  constructor(
    public dialogRef: MatDialogRef<PreviousTransactionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fetchDonationTransactionService: FetchDonationTransactionService,
    public dateFormaterService: DateFormaterService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {
    super(dialog, snackBar);
    this.currentTransaction = data.transactionDetails;
    this.modeOfTransaction = data.transactionModes;
  }

  getModeOfTransaction(id) {
    let mode = this.modeOfTransaction.filter(
      tansactionMode => tansactionMode.id == id
    );
    if (mode.length > 0) return mode[0].name;
    return "NULL";
  }

  ngOnInit() {
    if (this.currentTransaction.transaction_id) {
      this.loadTransactionByTransactionId();
    }
    else {
      this.loadTransactions();
    }
  }

  loadTransactionByTransactionId() {
    this.presentLoader();
    var params = {
      transaction_id: this.currentTransaction.transaction_id,
      status: 3
    }
    this.fetchDonationTransactionService
      .get(params)
      .subscribe(transactionData => {
        this.dismissLoader();
        if (transactionData.length > 0) {
          this.pastTransaction = [];
          transactionData.forEach(data => {
            this.pastTransaction.push(new DonationTransaction().deserialize(data));
          });
          this.dataSource = new MatTableDataSource(this.pastTransaction);
        } else {
          this.loadTransactions();
        }
      })
  }

  loadTransactions() {
    this.presentLoader();
    var params = {
      start_date: this.dateFormaterService.converDateToYmd(new Date().setDate(new Date().getDate() - 30)),
      end_date: this.dateFormaterService.converDateToYmd(new Date().setDate(new Date().getDate() + 1)),
      donar__username: this.currentTransaction.donar.username,
      status: 3
    };
    this.fetchDonationTransactionService
      .get(params)
      .subscribe(transactionData => {
        this.dismissLoader();
        this.pastTransaction = [];
        transactionData.forEach(data => {
          this.pastTransaction.push(new DonationTransaction().deserialize(data));
        });
        this.dataSource = new MatTableDataSource(this.pastTransaction);
        console.log("Past", this.pastTransaction);
      });
  }

  close() {
    this.dialogRef.close();
  }

  verifyTransaction() {
    let status: verification = { verify : true, notVerify : false }
    this.dialogRef.close(status);
  }

  notVerifyTransaction() {
    let status: verification = { notVerify : true, verify : false }
    this.dialogRef.close(status);
  }

  get columnsToDisplay() {
    return [
      "name",
      "number",
      "mode",
      "transactionId",
      "amount",
      "donatedDate",
      "telecallerId",
      "telecallerName"
    ];
  }

}
