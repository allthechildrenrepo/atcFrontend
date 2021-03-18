import { Component, OnInit, Input } from '@angular/core';
import { WhatsAppTransaction } from 'src/app/shared/model/whats-app-transaction';

@Component({
  selector: 'app-receipt-details',
  templateUrl: './receipt-details.component.html',
  styleUrls: ['./receipt-details.component.scss']
})
export class ReceiptDetailsComponent implements OnInit {

  @Input() dataSource;
  @Input() columnsToDisplay: string[] = [
    "reciptId",
    "mode",
    "transactionId",
    "amount",
    "branch",
    "status",
    "donatedDate",
    "generateReceipt"
  ];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
  }

  viewReceipt(transaction: WhatsAppTransaction) {
    window.open(transaction.reciptUrl, '_blank')
  }

}