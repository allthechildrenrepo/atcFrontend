import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { WhatsAppTransaction } from 'src/app/shared/model/whats-app-transaction';
import { TableUtil } from "../../shared/TableUtil";
import { ReciptFormComponent } from '../recipt-form/recipt-form.component';


@Component({
  selector: 'app-receipt-details',
  templateUrl: './receipt-details.component.html',
  styleUrls: ['./receipt-details.component.scss']
})
export class ReceiptDetailsComponent implements OnInit {

  @Input() dataSource;
  @Input() columnsToDisplay: string[] = [
    "receipt_id",
    "medium",
    "transaction",
    "donar_name",
    'whatsapp_number',
    "amount",
    "branch",
    "is80G",
    'sendUser',
    'generate_recipt',
    "receipt"
  ];

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  downloadTable(tableId) {
    TableUtil.exportToExcel(tableId, "whatsapp-transaction");
  }

  ngOnChanges() {
  }

  generateReceipt(transaction) {
    const dialogRef = this.dialog.open(ReciptFormComponent, {
      width: "120vw",
      autoFocus: false,
      maxHeight: "90vh",
      data: { transactionDetails: transaction, reciptDetails: true, showReciptForm: false }
    });

  }

  viewReceipt(transaction: WhatsAppTransaction) {
    window.open(transaction.reciptUrl, '_blank')
  }

}
