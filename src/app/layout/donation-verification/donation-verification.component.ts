import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from "@angular/material";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";

import { BasePage } from 'src/app/utils/pages/base/base.component';
import { Batch } from "../../shared/model/batch";
import { BatchService } from "../../shared/services/batch.service";
import { Branch } from "../../shared/model/branch";
import { BranchService } from "../../shared/services/branch.service";
import { DateFormaterService } from "../../shared/services/date.service";
import { DonationApproveService } from "../../shared/services/donation-approve.service";
import { DonationTransaction } from "../../shared/model/donation-transaction";
import { FetchDonationTransactionService } from "../../shared/services/fetch-donation-transaction.service";
import { User } from "../../shared/model";
import { of } from "rxjs";

@Component({
  selector: "app-donation-verification",
  templateUrl: "./donation-verification.component.html",
  styleUrls: ["./donation-verification.component.scss"],
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({ height: "0px", minHeight: "0", visibility: "hidden" })
      ),
      state("expanded", style({ height: "*", visibility: "visible" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
})
export class DonationVerificationComponent extends BasePage implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  fromDate: any;
  toDate: any;
  tomorrow: any;

  approvedDonationList: DonationTransaction[] = [];
  branches: Branch[] = [];
  batches: Batch[] = [];
  branchId: number;
  branchSelected: boolean = false;
  selectedBatch: Batch;
  selectedBranch: number;
  alerts = [];
  ColumnsDetails = [
    {
      "Donor ID": "donor_id",
      Amount: "amount",
      Branch: "branch",
      Telecaller: "teleCallerAtcId",
      Verified: "is_verified"
    },
    {
      "Transaction ID": "transaction_id",
      "Cheque No": "cheque_number",
      Attempt: "verification_attempt",
      "Transaction mode": "mode_of_transaction",
      "Receipt send": "receipt_send",
      "Wishes Requested": "wishes_requested",
      "Wishes sent": "wishes_sent"
    }
  ];
  expandedElement: any;
  dataSource;
  verified: boolean = false;

  constructor(
    public branchService: BranchService,
    public batchService: BatchService,
    public donationApproveService: DonationApproveService,
    public fetchDonationTransactionService: FetchDonationTransactionService,
    public dateFormaterService: DateFormaterService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {
    super(dialog, snackBar);
  }

  ngOnInit() {
    this.presentLoader();
    let user = new User().deSerialize(JSON.parse(localStorage.getItem("user")));
    this.branchId = user.branch[0].branchId;
    this.branchService.get().subscribe(
      response => {
        this.dismissLoader();
        response.results.forEach(data => {
          this.branches.push(new Branch().deserialize(data));
        });
      },
      err => {
        this.dismissLoader();
        this.somethingWentWrong();
      }
    );
    // this.fetchbatch();
  }
  
  setDateFilter(date){
    this.fromDate = date.fromDate;
    this.toDate = date.toDate;
    this.tomorrow = date.tomorrow;
    this.fetchbatch();
  }

  fetchbatch(refresh: boolean = false) {
    this.presentLoader();
    var param = {
      start_date: this.dateFormaterService.converDateToYmd(this.fromDate),
      end_date: this.dateFormaterService.converDateToYmd(this.tomorrow)
    };

    this.batchService
      .get(param)
      .subscribe(
        res => {
          this.dismissLoader();
          this.batches = [];
          if (res.results.length == 0) {
            this.showAlert("success", `There is no batch for verification under given date`);
            return;
          }
          res.results.forEach(data => {
            this.batches.push(new Batch().deserialize(data));
          });
          if (refresh) {
            const refreshBatch = this.batches.filter(
              (batch: Batch) => batch.id == this.selectedBatch.id
            );
            this.showDonation(refreshBatch[0]);
          }
        },
        err => {
          this.dismissLoader();
          this.somethingWentWrong();
        }
      );
  }

  resetBatch() {
    this.batches = [];
  }

  showDonation(batch: Batch) {
    this.selectedBatch = batch;
    this.approvedDonationList = [];
    this.approvedDonationList = batch.donations.filter((donation: DonationTransaction) => donation._status != 3);
    this.branchSelected = true;
  }

  resetBranch() {
    this.approvedDonationList = [];
    this.branchSelected = false;
  }

  refreshBatch() {
    this.fetchbatch(true);
    this.showAlert('success', 'Donation transaction was updated successfully');
  }

  showAlert(type, message) {
    this.alerts = [];
    this.alerts.push({
      id: 1,
      type: type,
      message: message
    });

    setTimeout(() => {
      this.alerts = [];
    }, 3000);
  }

  /**this get verified list will get branch wise not batches */
  getVerifiedList() {
    this.presentLoader();
    this.approvedDonationList = [];
    this.fetchDonationTransactionService
      .get({ branch: this.selectedBranch })
      .subscribe(
        response => {
          this.dismissLoader();
          if (response.results.length === 0) {
            this.showAlert("success", `There is no data for verification.`);
          }
          response.results.forEach(data => {
            this.approvedDonationList.push(
              new DonationTransaction().deserialize(data)
            );
          });
        },
        err => {
          this.dismissLoader();
          this.somethingWentWrong();
        }
      );
  }

  checkBatch(batch:Batch):boolean {
    return batch.donations.every((donation : DonationTransaction) => donation._status > 1)
  }

  public closeAlert(alert: any) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

  getRows(data) {
    const rows = [];
    data.forEach(element => rows.push(element, { detailRow: true, element }));
    return of(rows);
  }

  getBranchDetails(branchId) {
    this.selectedBranch = branchId;
    this.branchSelected = true;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  get columnsToDisplay() {
    return [
      "name",
      "number",
      "mode",
      "transactionId",
      "amount",
      "telecallerId",
      "voiceCallingName",
      "telecallerName",
      "donatedDate",
      "status",
      "verify",
      "edit",
      "screenShot",
      "details"
    ];
  }
}
