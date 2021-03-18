import { AtcUser, DonarProfile, User } from "../../shared/model";
import { Component, OnInit } from "@angular/core";
import { DonationTransaction } from "../../shared/model/donation-transaction";
import { DonorService } from "../../shared/services/donor.service";
import { FetchDonationTransactionService } from "../../shared/services/fetch-donation-transaction.service";
import { BasePage } from 'src/app/utils/pages/base/base.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DonationEntryComponent } from '../donation-entry/donation-entry.component';
import { EditDonorDetailsComponent } from '../edit-donor-details/edit-donor-details.component';

@Component({
  selector: "app-donar-search-page",
  templateUrl: "./donar-search-page.component.html",
  styleUrls: ["./donar-search-page.component.scss"]
})
export class DonarSearchPageComponent extends BasePage {
  public alerts: Array<any> = [];

  searchField: string = "";
  donorProfile: any;
  transferDetail: DonationTransaction[] = [];
  atcDonor: AtcUser;
  alert = [];
  user: User;

  constructor(
    private fetchDonationTransactionService: FetchDonationTransactionService,
    private searchDonarProfileService: DonorService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {
    super(dialog, snackBar);
    this.user = new User().deSerialize(
      JSON.parse(localStorage.getItem("user"))
    );
  }

  searchDonar() {
    if (this.searchField.length != 10) {
      this.showMessage("failure","Number should be 10 digit")
      return;
    }
    this.showDonarDetails();
  }

  showDonarDetails() {
    this.presentLoader();
    this.donorProfile = null;
    this.transferDetail = [];
    this.atcDonor = null;
    const params = this.searchDonarProfileService.getParams(this.searchField);
    this.searchDonarProfileService.get(params).subscribe(donorProfile => {
      this.dismissLoader();
      if(donorProfile.length == 0) {
        var message = this.searchField+" Donar number does not exisits";
        this.showMessage("danger", message);
        return;    
      }
      this.atcDonor = new AtcUser().deserialize(donorProfile[0]);
      this.loadTransactions();
    },
    err => {
      this.dismissLoader();
      this.somethingWentWrong();
    });
  }

  showMessage(type, message) {
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

  public closeAlert(alert: any) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

  editDonarDetails() {
    const dialogRef = this.dialog.open(EditDonorDetailsComponent, {
      width: "50vw",
      autoFocus: false,
      maxHeight: "90vh",
      data: this.atcDonor
    });

    dialogRef.afterClosed().subscribe((refresh: boolean) => {
      if(refresh){
      this.showDonarDetails();
      this.showMessage("success", "Donor Details was updated successfully");

        // this.refresh.emit();
      }
    });
  }

  loadTransactions() {
    this.presentLoader();
    this.donorProfile = this.atcDonor;
    this.fetchDonationTransactionService
      .get({
        donar__username: this.atcDonor.username,
        branch: this.user.branch[0].branchId
      })
      .subscribe(transferData => {
        this.dismissLoader();
        this.transferDetail = [];
        transferData.forEach(data => {
          this.transferDetail.push(new DonationTransaction().deserialize(data));
        });
      });
  }

  get columnsToDisplay() {
    return [
      "mode",
      "transactionId",
      "amount",
      "branch",
      "status",
      "donatedDate",
      "details"
    ];
  }
}
