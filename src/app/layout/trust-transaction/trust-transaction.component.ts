import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/utils/pages/base/base.component';
import { DateFormaterService } from "src/app/shared/services/date.service";
import { DonationTransaction } from "../../shared/model/donation-transaction";
import { FetchDonationTransactionService } from "../../shared/services/fetch-donation-transaction.service";
import { MatDialog, MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-trust-transaction',
  templateUrl: './trust-transaction.component.html',
  styleUrls: ['./trust-transaction.component.scss']
})
export class TrustTransactionComponent extends BasePage implements OnInit {

  fromDate;
  toDate;
  tomorrow;
  alerts = [];
  transactionDetails = [];

  constructor(
    public fetchDonationTransactionService: FetchDonationTransactionService,
    public dateFormaterService: DateFormaterService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {
    super(dialog, snackBar);
  }

  ngOnInit() {
  }

  setDateFilter(date) {
    this.fromDate = date.fromDate;
    this.toDate = date.toDate;
    this.tomorrow = date.tomorrow;
    this.getDonationList();
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

  getDonationList() {
    this.presentLoader();
    var params = {
      status: 0,
      branch: 16,
      start_date: this.dateFormaterService.converDateToYmd(this.fromDate),
      end_date: this.dateFormaterService.converDateToYmd(this.tomorrow),
    };

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
      "donatedDate"
    ];
  }

}
