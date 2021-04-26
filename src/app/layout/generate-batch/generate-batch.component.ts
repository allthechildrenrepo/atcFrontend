import { Component, Inject, Input, OnInit } from "@angular/core";
import { FetchDonationTransactionService } from "../../shared/services/fetch-donation-transaction.service";
import { DonationTransaction } from "../../shared/model/donation-transaction";
import { User } from '../../shared/model';
import { BatchService } from '../../shared/services/batch.service';
import { MatDialog, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { BasePage } from 'src/app/utils/pages/base/base.component';
import { Branch } from 'src/app/shared/model/branch';
import { BranchService } from "../../shared/services/branch.service";

@Component({
  selector: "app-generate-batch",
  templateUrl: "./generate-batch.component.html",
  styleUrls: ["./generate-batch.component.scss"]
})
export class GenerateBatchComponent extends BasePage implements OnInit {
  batchList: DonationTransaction[] = [];
  transactionDetails: DonationTransaction[] = [];
  branchId: number;
  alerts = [];
  userBranches = [];
  allBranches = [];
  selectedBranch: number;
  branchName: string;
  batchListLength = 0

  constructor(
    public fetchDonationTransactionService: FetchDonationTransactionService,
    public batchService: BatchService,
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
          response.results.forEach(data => {
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
    this.dismissLoader();

    this.batchList = [];
    // let user = new User().deSerialize(JSON.parse(localStorage.getItem('user')));
    // this.branchId = user.branch[0].branchId;
    // this.getDonationList();
  }

  getDonationList() {
    this.presentLoader();
    this.fetchDonationTransactionService
      .get({ status: 0, branch: this.selectedBranch })
      .subscribe(response => {
        this.dismissLoader();
        this.transactionDetails = [];
        response.results.forEach(data => {
          // not ot show pick up while generating batch
          if ([14, 15, 16, 17, 18].indexOf(+data.mode_of_transaction_id) == -1) {
            this.transactionDetails.push(
              new DonationTransaction().deserialize(data)
            );
          }
        });
        if (this.transactionDetails.length == 0) {
          this.showSuccessMessage("No transaction list for creating batch");
        }
      });
  }

  get columnsToDisplay() {
    return [
      "checkbox",
      "mode",
      "transactionId",
      "amount",
      "status",
      "telecallerId",
      "voiceCallingName",
      "telecallerName",
      "donatedDate",
      "edit",
      "screenShot",
      "delete"
    ];
  }

  checkBoxChange(event) {
    if (event.checked) this.batchList.push(event.data);
    else {
      const index: number = this.batchList.indexOf(event.data);
      this.batchList.splice(index, 1);
    }
    this.batchList = [...new Set(this.batchList)];
    console.log("BatchList", this.batchList)
    this.batchListLength = this.batchList.length;
  }

  refreshDonationList() {
    this.getDonationList();
    this.showSuccessMessage("Donation Transaction was updated successfully");
  }

  setBranch(branch) {
    this.selectedBranch = branch.branchId;
    this.branchName = branch.branchName;
    this.getDonationList();
  }

  removeBranch() {
    this.selectedBranch = null;
    this.transactionDetails = [];
  }

  checkBatch() {
    let selectedDonation = [];
    if (this.batchList.length > 50) {
      this.batchList.splice(50);
      this.batchList.forEach((donation) => selectedDonation.push(donation.ID));
      const dialogRef = this.dialog.open(BatchSelectionAlert, {
        width: "50vw",
        autoFocus: false,
        maxHeight: "90vh",
        data: this.batchListLength
      });

      dialogRef.afterClosed().subscribe((data) => {
        console.log("Dialog box closed", data, selectedDonation);
        if (data) {
          this.generateBatch(selectedDonation);
        }
      });
    }
    else {
      this.batchList.forEach((donation) => selectedDonation.push(donation.ID));
      this.generateBatch(selectedDonation);
    }

  }

  generateBatch(donation) {
    this.presentLoader();
    this.batchService.post({ 'branch_id': this.selectedBranch, 'donation_ids': donation })
      .subscribe((res) => {
        this.dismissLoader();
        this.transactionDetails = [];
        this.batchList = [];
        this.batchListLength = 0;
        this.showSuccessMessage("Batch Created for the selected list");
        this.getDonationList();
      }, (err) => {
        this.dismissLoader();
        this.somethingWentWrong();
      });
  }

  public showSuccessMessage(message) {
    this.alerts = [];
    this.alerts.push({
      id: 1,
      type: "success",
      message: message
    });

    setTimeout(() => {
      this.alerts = [];
    }, 3000)
  }

  public showFailureMessage(message) {
    this.alerts.push({
      id: 1,
      type: "danger",
      message: message
    });
  }

  public closeAlert(alert: any) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }
}

@Component({
  selector: "batch-selection-alert",
  templateUrl: "./batch-selection-alert.html",
  styleUrls: ["./generate-batch.component.scss"]
})
export class BatchSelectionAlert {

  batchListLength;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BatchSelectionAlert>
  ) {
    this.batchListLength = data;
  }

  generateBatch() {
    this.dialogRef.close(true);
  }

  close() {
    this.dialogRef.close();
  }
}
