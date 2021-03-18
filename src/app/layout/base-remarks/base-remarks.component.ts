import { Component, OnInit, ViewChild } from '@angular/core';
import { User, AtcUser, Leads } from 'src/app/shared/model';
import { TelecallerFetchService } from 'src/app/shared/services/telecaller.service';
import { BasePage } from 'src/app/utils';
import { MatDialog, MatSnackBar, MatSort, MatTableDataSource, Sort } from '@angular/material';
import { LeadFetchService, LeadRequestService } from 'src/app/shared/services/leads';

@Component({
  selector: 'app-base-remarks',
  templateUrl: './base-remarks.component.html',
  styleUrls: ['./base-remarks.component.scss']
})
export class BaseRemarksComponent extends BasePage implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  selectedBranch: number;
  selectedBranchName;
  user: User;
  telecallers = [];
  leads: Leads[];
  selectedTelecaller;
  displayedColumns = ['lead_phone', 'remarks', 'convert_to_contact'];
  dataSource: MatTableDataSource<Leads>;

  constructor(
    public telecallerService: TelecallerFetchService,
    public leadfetchService: LeadFetchService,
    public leadRequestService: LeadRequestService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {
    super(dialog, snackBar);
  }

  ngOnInit() {
    this.user = new User().deSerialize(JSON.parse(localStorage.getItem('user')));
    if (this.user.branch.length === 1) {
      this.setBranch(this.user.branch[0]);
    }
  }

  setBranch(branch) {
    this.selectedBranch = branch.branchId;
    this.selectedBranchName = branch.branchName;
    this.fetchTeleCallers();
  }

  removeBranch() {
    this.selectedBranch = null;
    this.selectedBranchName = null;
  }

  fetchTeleCallers() {
    this.presentLoader();
    let params = { 'atc_profile__branch__id': this.selectedBranch };
    this.telecallerService.get(params).subscribe(
      res => {
        this.dismissLoader();
        this.telecallers = [];
        res.forEach(data => {
          this.telecallers.push(new AtcUser().deserialize(data));
        });
      },
      err => {
        this.dismissLoader();
        this.somethingWentWrong();
      }
    );
  }

  fetchLeads() {
    this.presentLoader();
    this.leads = [];
    let params = {
      // telecaller_id: 1,
      telecaller_id: this.selectedTelecaller,
      status: 2
    }
    this.leadfetchService.get(params).subscribe((data) => {
      data.forEach(element => {
        this.leads.push(new Leads().deserializer(element));
      });
      this.dataSource = new MatTableDataSource(this.leads);
      this.dataSource.filterPredicate =
        (data: Leads, filter: string) => data.phone.indexOf(filter) != -1;
      this.dismissLoader();
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  statusUpdate(event, id) {
    console.log("telecaller", event, id);
    let params = {
      remarks: event.value,
      status: 3
    }
    this.leadfetchService.leadId = id;
    this.leadfetchService.put(params).subscribe(
      data => {
        console.log("leadRequestService is working");
      },
      err => {
        console.log("Error");
      }
    );
  }

  convertToContact(event, id) {
    console.log("telecaller", event, id);
    let params = {
      remarks: event.value,
      status: 4
    }
    this.leadfetchService.leadId = id;
    this.leadfetchService.put(params).subscribe(
      data => {
        console.log("leadRequestService is working");
      },
      err => {
        console.log("Error");
      }
    );
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

}
