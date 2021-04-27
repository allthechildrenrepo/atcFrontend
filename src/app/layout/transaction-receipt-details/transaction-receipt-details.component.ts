import { Component, OnInit, Inject, Input } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MatSnackBar,
  MAT_DIALOG_DATA,
} from '@angular/material';
import { BasePage } from 'src/app/utils/pages/base/base.component';
import { DonationTransaction } from 'src/app/shared/model/donation-transaction';
import { TransactionModeService } from 'src/app/shared/services/transaction-mode.service';
import { WhatsAppTransactionService } from 'src/app/shared/services/whatsapp-transaction.service';
import { WhatsAppTransaction } from 'src/app/shared/model/whats-app-transaction';


@Component({
  selector: 'app-transaction-receipt-details',
  templateUrl: './transaction-receipt-details.component.html',
  styleUrls: ['./transaction-receipt-details.component.scss']
})
export class TransactionReceiptDetailsComponent extends BasePage implements OnInit {

  donationTransaction: DonationTransaction;
  modeOfTransaction;
  transaction;

  constructor(
    public whatsAppTransactionService: WhatsAppTransactionService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<TransactionReceiptDetailsComponent>
  ) {
    super(dialog, snackBar);
    this.donationTransaction = data.transactionDetails;
    this.modeOfTransaction = data.modeOfTransaction;
  }

  ngOnInit() {
    var param = {
      donation: this.donationTransaction.id
    };
    this.fetchWhatsAppTransaction(param);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  fetchWhatsAppTransaction(param) {
    this.presentLoader();
    this.transaction = [];
    this.whatsAppTransactionService.get(param).subscribe((data) => {
      data.forEach(element => {
        this.transaction.push(new WhatsAppTransaction().deserializer(element));
      });
      this.dismissLoader();
    }, err => {
      this.somethingWentWrong();
      this.dismissLoader();
    })
  }

  get columnsToDisplay() {
    return [
      'created_date',
      'donation_id',
      'medium',
      'receipt_id',
      'whatsapp_number',
      'sendUser',
      'branch',
      "payment_mode",
      'receipt'
    ];
  }

}
