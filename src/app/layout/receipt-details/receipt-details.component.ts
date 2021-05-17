import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
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
  @Input() mode = 'normalMode';
  @Output() refreshParent= new EventEmitter<any>();

  @Input() columnsToDisplay: string[] = [
    "checkbox",
    "receipt_id",
    "medium",
    "transaction",
    "donar_name",
    'whatsapp_number',
    "amount",
    "branch",
    "is80G",
    "payment_mode",
    "upload_by",
    "approved_by",
    'generate_recipt',
  ];

  @Output() checkboxEvent = new EventEmitter();
  @Output() refresh = new EventEmitter();
  selection = new SelectionModel<any>(true, []);


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
      data: { transactionDetails: transaction, mode:this.mode, reciptDetails: true, showReciptForm: false }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.refreshParent.emit()
    });


  }

  viewReceipt(transaction: WhatsAppTransaction) {
    window.open(transaction.reciptUrl, '_blank')
  }

  checkBoxEvent(event, tableData) {
    const emitValue = { checked: event.checked, data: tableData };
    this.checkboxEvent.emit(emitValue);
    event ? this.selection.toggle(tableData) : null;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  masterToggle(event) {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.forEach(
        row => {
          this.selection.select(row);
          const emitValue = { checked: event.checked, data: row };
          this.checkboxEvent.emit(emitValue);
        });
    if (!event.checked) {
      this.dataSource.forEach(
        row => {
          const emitValue = { checked: event.checked, data: row };
          this.checkboxEvent.emit(emitValue);
        });
    }
  }

}
