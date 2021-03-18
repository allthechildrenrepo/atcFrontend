import { Component, OnInit } from '@angular/core';
import { FetchDonationTransactionService } from "../../shared/services/fetch-donation-transaction.service";
import { DonationTransaction } from "../../shared/model/donation-transaction";
import { User } from '../../shared/model';
import { BasePage } from 'src/app/utils/pages/base/base.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Branch } from '../../shared/model/branch';
//For mock Batch service
import { DateFormaterService } from 'src/app/shared/services/date.service';
import { BatchService } from 'src/app/shared/services/batch.service';

@Component({
  selector: 'app-not-verified-list',
  templateUrl: './not-verified-list.component.html',
  styleUrls: ['./not-verified-list.component.scss']
})
export class NotVerifiedListComponent extends BasePage implements OnInit {

  selectedBranch: Branch;
  batchList: DonationTransaction[] = [];
  transactionDetails: DonationTransaction[] = [];
  branchId: number;
  user: User;
  donorId: any;
  telecallerId: any;
  intervalId;
  alerts = [];

  constructor(
    public fetchDonationTransactionService: FetchDonationTransactionService,
    //For mock Batch service
    public dateFormaterService: DateFormaterService,
    public batchService: BatchService,
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

  setBranch(branch: Branch) {
    this.selectedBranch = branch;
    this.branchId = this.selectedBranch.branchId;
    this.batchList = [];
    var params = {
      status: 2,
      branch: this.branchId,
    }
    this.getDonationList(params);
    // this.intervalId = setInterval(() => this.fetchbatch(), 10000);
  }

  filterByDonorId() {
    var params = {
      status: 2,
      branch: this.branchId,
    };
    if (this.donorId) {
      params['donar__username'] = this.donorId
    }
    this.getDonationList(params);
    this.resetTelecallerIdFiler();
  }

  filterBytelecallerId() {
    var params = {
      status: 2,
      branch: this.branchId,
      telecaler_id: this.telecallerId
    }
    this.getDonationList(params);
    this.resetDonorIdFilter();
  }

  resetDonorIdFilter() {
    this.donorId = null;
  }

  resetTelecallerIdFiler() {
    this.telecallerId = null;
  }

  removeBranch() {
    this.selectedBranch = null;
  }


  playAudio() {
    const audio = new Audio();
    audio.src = "assets/" + 'notification_tone.mp3';
    audio.load();
    audio.play();
  }

  // //For mock Batch service
  // fetchbatch() {
  //   var param = {
  //     start_date: '2020-7-25',
  //     end_date: '2020-8-1'
  //   };

  //   this.batchService
  //     .get(param)
  //     .subscribe(
  //       res => {
  //         res.forEach(data => {
  //           if (localStorage.getItem('batchId')) {

  //             if (localStorage.getItem('batchId') < res[res.length - 1].id) {
  //               this.showAlert("success", "New Batch is generated");
  //               this.playAudio();
  //               localStorage.setItem("batchId", res[res.length - 1].id);
  //             }
  //           }
  //           else {
  //             localStorage.setItem("batchId", res[res.length - 1].id);
  //           }
  //         });
  //       },
  //       err => {
  //       }
  //     );
  // }

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

  getDonationList(params) {
    this.presentLoader();
    this.transactionDetails = [];
    this.fetchDonationTransactionService
      .get(params)
      .subscribe(response => {
        response.forEach(data => {
          if ([14, 15, 16, 17, 18].indexOf(+data.mode_of_transaction_id) == -1) {
            this.transactionDetails.push(
              new DonationTransaction().deserialize(data)
            );
          }
        });
        this.dismissLoader();

        if (this.transactionDetails.length == 0) {
          this.showAlert("success", "There is no transaction under not verified status");
        }
      });
    this.dismissLoader();
  }

  get columnsToDisplay() {
    return [
      "name",
      "number",
      "mode",
      "transactionId",
      "amount",
      "status",
      "telecallerId",
      "voiceCallingName",
      "telecallerName",
      "donatedDate",
      "remarks",
      "edit"
    ];
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
