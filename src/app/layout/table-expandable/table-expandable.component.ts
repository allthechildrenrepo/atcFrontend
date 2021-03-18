import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { MatPaginator, MatTableDataSource, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
// import { DonationTransaction } from '../../shared/model/donation-transaction';
// import { DonationApproveService } from '../../shared/services/donation-approve.service';
// import { ImageDialogComponent } from '../image-dialog/image-dialog.component';
// import { BranchService } from "../../shared/services/branch.service";
// import { TransactionModeService } from "../../shared/services/transaction-mode.service";
// import { Branch } from "../../shared/model/branch";
// import { EditDonorTransactonComponent } from '../edit-donor-transacton/edit-donor-transacton.component';
// import { BasePage } from 'src/app/utils/pages/base/base.component';


@Component({
  selector: 'app-table-expandable',
  templateUrl: './table-expandable.component.html',
  styleUrls: ['./table-expandable.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class TableExpandableComponent {
//   @Input() tableRecords: DonationTransaction[];
//   @Input() columnData: any[];
//   @Input() transactionVerified: boolean = false;
//   @Output() transactionId = new EventEmitter();
//   branches: Branch[] = [];
//   modeOfTransaction = [];
//   expandedElement: DonationTransaction;
//   dataSource: any;
//   columnsToDisplay: string[];
//   loaderVerify: boolean = false;

//   constructor(public dialog: MatDialog,
//     public donationApproveService: DonationApproveService,
//     public branchService: BranchService,
//     public transactionModeService: TransactionModeService,
//     public snackBar: MatSnackBar
//   ) {
//     super(dialog, snackBar);
//   }

//   ngOnInit() {
//     this.presentLoader();
//     this.branchService.get().subscribe(
//       response => {
//         this.dismissLoader();
//         response.forEach(data => {
//           this.branches.push(new Branch().deserialize(data));
//         });
//       },
//       err => {
//         this.dismissLoader();
//         this.somethingWentWrong();
//       }
//     );

//     this.transactionModeService.get().subscribe(
//       data => {
//         this.dismissLoader();
//         this.modeOfTransaction = data;
//       },
//       err => {
//         this.dismissLoader();
//         this.somethingWentWrong();
//       }
//     );
//   }

//   ngOnChanges() {
//     this.dataSource = new MatTableDataSource<DonationTransaction>(this.tableRecords);
//     this.columnsToDisplay = Object["values"](this.columnData[0]);
//   }

//   applyFilter(filterValue: string) {
//     filterValue = filterValue.trim(); // Remove whitespace
//     filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
//     this.dataSource.filter = filterValue;
//   }

//   valueType(value) {
//     return typeof (value)
//   }
//   setVerified(donortransaction) {
//     this.loaderVerify = true;
//     this.transactionId.emit(donortransaction.transaction_id);
//     // Mock for loader geting response after 3sec
//     setTimeout(() => {
//       donortransaction.is_verified = this.transactionVerified;
//     }, 3000);
//   }

 

//   showReceipt(donarTransactionDetails) {
//     const dialogRef = this.dialog.open(EditDonorTransactonComponent, {
//       width: '50vw',
//       autoFocus: false,
//       maxHeight: '90vh',
//       data: { transactionDetails: donarTransactionDetails, reciptDetails: true }
//     });

//     dialogRef.afterClosed().subscribe(res => {
//     });
//   }

//   editTransactionDetails(donarTransactionDetails) {
//     const dialogRef = this.dialog.open(EditDonorTransactonComponent, {
//       width: '50vw',
//       autoFocus: false,
//       maxHeight: '90vh',
//       data: { transactionDetails: donarTransactionDetails, reciptDetails: false }
//     });

//     dialogRef.afterClosed().subscribe(res => {
//     });
//   }

//   openScreenshot(imgSrc) {
//     const dialogRef = this.dialog.open(ImageDialogComponent, {
//       width: '45vw',
//       autoFocus: false,
//       maxHeight: '45vh',
//       data: imgSrc
//     });

//     dialogRef.afterClosed().subscribe(res => {
//     });
//   }

//   approveDonation(donationTransaction) {
//     this.presentLoader();
//     this.loaderVerify = true;
//     this.donationApproveService.donationId = donationTransaction.id;
//     const formData = new FormData();
//     formData.append('is_verified', 'true');
//     this.donationApproveService.put(formData).subscribe((response) => {
//       this.dismissLoader();
//       if (response.status) {
//         this.loaderVerify = false;
//         donationTransaction.is_verified = true;
//       }
//     }, (err) => {
//       this.dismissLoader();
//       this.somethingWentWrong();
//     })
//   }

//   notVerifiedTransaction(donarTransactionDetails) {
//     this.presentLoader();
//     this.donationApproveService.donationId = donarTransactionDetails.id;
//     const formData = new FormData();
//     formData.append('status', '2');
//     this.donationApproveService.put(formData).subscribe((response) => {
//       this.dismissLoader();
//       if (response.status) {
//         this.loaderVerify = false;
//         donarTransactionDetails.is_verified = false;
//       }
//     }, (err) => {
//       this.dismissLoader();
//       this.somethingWentWrong();
//     })
//   }
}