import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/model';
import { BatchService } from 'src/app/shared/services/batch.service';
import { Batch } from 'src/app/shared/model/batch';
import { BasePage } from 'src/app/utils/pages/base/base.component';
import { MatDialog, MatSnackBar } from "@angular/material";
import { DateFormaterService } from 'src/app/shared/services/date.service';
import { DonationTransaction } from 'src/app/shared/model/donation-transaction';



@Component({
  selector: 'app-batch-details',
  templateUrl: './batch-details.component.html',
  styleUrls: ['./batch-details.component.scss']
})
export class BatchDetailsComponent extends BasePage implements OnInit {

  selectedBranch: number;
  selectedBranchName;
  user: User;
  fromDate: any;
  toDate: any;
  tomorrow: any;
  batches: Batch[] = [];
  approvedDonationList: DonationTransaction[] = [];
  branchSelected: boolean = false;
  selectedBatch: Batch;

  constructor(
    public batchService: BatchService,
    public dateFormaterService: DateFormaterService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {
    super(dialog, snackBar); }

  ngOnInit() {
    this.user = new User().deSerialize(JSON.parse(localStorage.getItem('user')));
    if(this.user.branch.length === 1) {
      this.setBranch(this.user.branch[0]);
    }
  }

  setBranch(branch) {
    this.selectedBranch = branch.branchId;
    this.selectedBranchName = branch.branchName;
  }

  resetBatch() {
    this.batches = [];
  }

  removeBranch() {
    this.selectedBranch = null;
    this.selectedBranchName = null;
  }

  resetBranch() {
    this.approvedDonationList = [];
    this.branchSelected = false;
  }

  setDateFilter(date){
    this.fromDate = date.fromDate;
    this.toDate = date.toDate;
    this.tomorrow = date.tomorrow;
    this.fetchbatch();
  }

  showDonation(batch: Batch) {
    console.log(batch)
    this.selectedBatch = batch;
    this.approvedDonationList = [];
    this.approvedDonationList = batch.donations;
    this.branchSelected = true;
  }

  fetchbatch(refresh: boolean = false) {
    this.presentLoader();
    var param = {
      start_date: this.dateFormaterService.converDateToYmd(this.fromDate),
      end_date: this.dateFormaterService.converDateToYmd(this.tomorrow),
      branch_id: this.selectedBranch,
    };

    this.batchService
      .get(param)
      .subscribe(
        res => {
          this.dismissLoader();
          this.batches = [];
          if (res.results.length == 0) {
            // this.showAlert("success", `There is no batch for verification under given date`);
            return;
          }
          res.results.forEach(data => {
            this.batches.push(new Batch().deserialize(data));
          });
          if (refresh) {
            // const refreshBatch = this.batches.filter(
            //   (batch: Batch) => batch.id == this.selectedBatch.id
            // );
            // this.showDonation(refreshBatch[0]);
          }
        },
        err => {
          this.dismissLoader();
          this.somethingWentWrong();
          console.log(err);
        }
      );
  }

  get columnsToDisplay() {
    return [
      "name",
      "number",
      "mode",
      "transactionId",
      "amount",
      "donatedDate",
      "telecallerId",
      "voiceCallingName",
      "telecallerName",
      "status",
      "screenShot",
    ];
  }

}
