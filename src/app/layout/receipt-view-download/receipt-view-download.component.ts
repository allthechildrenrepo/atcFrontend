import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar } from "@angular/material";
import { BasePage } from '../../utils';


@Component({
  selector: 'app-receipt-view-download',
  templateUrl: './receipt-view-download.component.html',
  styleUrls: ['./receipt-view-download.component.scss']
})
export class ReceiptViewDownloadComponent extends BasePage {

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ReceiptViewDownloadComponent>,
  ) {
    super(dialog, snackBar);
  }

  closeReceipt() {
    this.dialogRef.close();
  }

}
