import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar } from "@angular/material";
import { BasePage } from '../../utils';
import { AtcUser } from '../../shared/model';


@Component({
  selector: 'app-assign-telecaller-list',
  templateUrl: './assign-telecaller-list.component.html',
  styleUrls: ['./assign-telecaller-list.component.scss']
})
export class AssignTelecallerListComponent extends BasePage implements OnInit {

  telecaller: AtcUser;
  donors: AtcUser[] = [];
  date: Date;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AssignTelecallerListComponent>

  ) {
    super(dialog, snackBar);
    this.telecaller = data.telecaller;
    this.donors = data.lead;
  }

  ngOnInit() {
    this.date = new Date();
  }

  printPage() {
    // let printContents, popupWin;
    // printContents = document.getElementById('print-section').innerHTML;
    // popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    // popupWin.document.open();
    // popupWin.document.write(`
    //   <html>
    //     <head>
    //       <title>Print tab</title>
    //       <style>
    //       table th, table td {border:1px solid #000;padding:0.5em;}     
    //       table { page-break-inside:auto }
    //       tr{ page-break-inside:avoid; page-break-after:auto }
    //       </style>
    //     </head>
    // <body onload="window.print();window.close()">${printContents}</body>
    //   </html>`
    // );

    let printContents;
    printContents = document.getElementById('print-section').innerHTML;

    document.body.innerHTML = printContents;
    document.title = '.';

    window.print();
  }

  closeDonorsList() {
    this.dialogRef.close();
  }

}
