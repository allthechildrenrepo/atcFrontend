import { Component, Input, OnInit } from "@angular/core";
import { MatDialog, MatSnackBar } from '@angular/material';

import { BasePage } from 'src/app/utils/pages/base/base.component';
import { Branch } from 'src/app/shared/model/branch';
import { BranchService } from "../../shared/services/branch.service";
import { DateFormaterService } from "src/app/shared/services/date.service";
import { DonationTransaction } from "../../shared/model/donation-transaction";
import { FetchDonationTransactionService } from "../../shared/services/fetch-donation-transaction.service";
import { User } from "../../shared/model";

@Component({
  selector: "app-verified-donation-list",
  templateUrl: "./verified-donation-list.component.html",
  styleUrls: ["./verified-donation-list.component.scss"]
})
export class VerifiedDonationListComponent extends BasePage implements OnInit {
  @Input() columnsToDisplay = [
    "name",
    "number",
    "mode",
    "transactionId",
    "amount",
    // "verifiedBy",
    "telecallerId",
    "voiceCallingName",
    "telecallerName",
    "donatedDate",
    "generateReceipt",
    "details",
  ];
  @Input() title = 'Verified Donation List';
  @Input() showBranches = true;

  batchList: DonationTransaction[] = [];
  transactionDetails: DonationTransaction[] = [];
  fromDate: any;
  toDate: any;
  tomorrow: any;
  minDate: any;
  alerts = [];
  userBranches = [];
  allBranches = [];
  donorId: any;
  telecallerId: any;
  selectedBranch: number;
  branchName: string;

  constructor(
    public fetchDonationTransactionService: FetchDonationTransactionService,
    public dateFormaterService: DateFormaterService,
    public branchService: BranchService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {
    super(dialog, snackBar);
  }

  ngOnInit() {
    let user = new User().deSerialize(JSON.parse(localStorage.getItem('user')));
    this.userBranches = user.branch;
    // check for admin branch and fetch all the branches.
    if (this.userBranches.find(group => group.branchId == 17)) {
      this.presentLoader();
      this.branchService.get().subscribe(
        response => {
          this.dismissLoader();
          response.forEach(data => {
            this.allBranches.push(new Branch().deserialize(data));
          });
        },
        err => {
          this.dismissLoader();
          this.somethingWentWrong();
        }
      );
    } else if (this.userBranches.length > 1) {
      this.allBranches = this.userBranches;
    } else {
      this.selectedBranch = this.userBranches[0];
      this.allBranches = this.userBranches;
      this.setBranch(this.selectedBranch);
    }
  }

  setBranch(branch) {
    this.selectedBranch = branch.branchId;
    this.branchName = branch.branchName;
  }

  setDateFilter(date) {
    this.fromDate = date.fromDate;
    this.toDate = date.toDate;
    this.tomorrow = date.tomorrow;
    this.setParams();
  }

  filterByDonorId() {
    var params = {
      status: 3,
      donar__username: this.donorId
    };

    if (this.showBranches) {
      params['branch'] = this.selectedBranch;
    }
    this.getDonationList(params);
    this.resetDateFilter();
    this.resetTelecallerIdFiler();
  }

  filterBytelecallerId() {
    var params = {
      status: 3,
      telecaler_id: this.telecallerId
    }

    if (this.showBranches) {
      params['branch'] = this.selectedBranch;
    }

    this.getDonationList(params);
    this.resetDonorIdFilter();
    this.resetDateFilter();
  }

  resetDateFilter() {
    this.fromDate = undefined;
    this.toDate = undefined;
    this.tomorrow = undefined;
  }

  resetDonorIdFilter() {
    this.donorId = null;
  }

  resetTelecallerIdFiler() {
    this.telecallerId = null;
  }

  removeBranch() {
    this.selectedBranch = null;
    this.transactionDetails = [];
  }

  setFromDate(dateEvent) {
    this.minDate = new Date(dateEvent.targetElement.value);
    this.fromDate = new Date(dateEvent.targetElement.value);
  }

  setToDate(dateEvent) {
    this.toDate = new Date(dateEvent.targetElement.value);
    this.tomorrow = new Date(dateEvent.targetElement.value);
  }

  setParams() {
    var params = {
      status: 3,
      start_date: this.dateFormaterService.converDateToYmd(this.fromDate),
      end_date: this.dateFormaterService.converDateToYmd(this.tomorrow),
    };

    if (this.showBranches) {
      params['branch'] = this.selectedBranch;
    }
    this.getDonationList(params);
    this.resetDonorIdFilter();
    this.resetTelecallerIdFiler();
  }

  getDonationList(params) {
    this.presentLoader();
    this.transactionDetails = [];
    this.fetchDonationTransactionService.get(params).subscribe(
      response => {
        this.dismissLoader();
        this.transactionDetails = [];
        if (response.length == 0) {
          this.showAlert("No donation under given dates", "success");
        } else {
          response.forEach(data => {
            this.transactionDetails.push(
              new DonationTransaction().deserialize(data)
            );
          });
        }
      },
      err => {
        this.dismissLoader();
        this.somethingWentWrong();
        this.showAlert(
          "Server Down, Please refresh the page and try again",
          "danger"
        );
      }
    );
  }

  showAlert(message, type) {
    this.alerts = [];
    this.alerts.push({
      id: 1,
      type: type,
      message: message
    });

    setTimeout(() => {
      this.alerts = [];
    }, 5000);
  }

}
