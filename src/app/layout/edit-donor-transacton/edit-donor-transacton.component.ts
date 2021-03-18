import { Component, OnInit, Inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';
import { DonationTransaction } from '../../shared/model/donation-transaction';
import { TransactionModeService } from '../../shared/services/transaction-mode.service';
import { DonationApproveService } from '../../shared/services/donation-approve.service';
import { ReciptDownloadComponent } from '../recipt-download/recipt-download.component';
import { BasePage } from 'src/app/utils/pages/base/base.component';
import { Router } from '@angular/router';


@Component({
  selector: "app-edit-donor-transacton",
  templateUrl: "./edit-donor-transacton.component.html",
  styleUrls: ["./edit-donor-transacton.component.scss"]
})
export class EditDonorTransactonComponent extends BasePage implements OnInit {

  transactionDetails: DonationTransaction;
  reciptDetails: boolean = false;
  modeOfTransaction = [];
  alerts = [];
  edit: boolean = false;
  editDonorDetails: boolean = true;
  editDetails: Array<any> = [];

  reciptForm: FormGroup;
  reciptId: FormControl;
  bank: FormControl;
  branch: FormControl;
  amountInWords: FormControl;
  donatedDate: FormControl

  constructor(
    public transactionModeService: TransactionModeService,
    public donationApproveService: DonationApproveService,
    public dialogRef: MatDialogRef<EditDonorTransactonComponent>,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(dialog, snackBar);
    this.editDetails = data.transactionDetails;
    this.transactionDetails = data.transactionDetails;
    this.reciptDetails = data.reciptDetails;
    this.editDonorDetails = data.editDonorDetails;
  }

  ngOnInit() {
    this.presentLoader();
    this.transactionModeService.get().subscribe(
      data => {
        this.dismissLoader();
        this.modeOfTransaction = data;
      },
      err => {
        this.dismissLoader();
        this.somethingWentWrong();
      }
    );

    if (this.reciptDetails) {
      this.validateInputs();
      this.createFormGroup();
    }
  }

  onSubmit(data) {
    if (data) {
      this.dialogRef.close(true);
      return;
    }
  }
  validateInputs() {
    this.reciptId = new FormControl("", [Validators.required]);
    this.bank = new FormControl("", Validators.required);
    this.branch = new FormControl();
    this.amountInWords = new FormControl("", Validators.required);
    this.donatedDate = new FormControl("", Validators.required)
  }

  createFormGroup() {
    this.reciptForm = new FormGroup({
      reciptId: this.reciptId,
      bank: this.bank,
      branch: this.branch,
      amountInWords: this.amountInWords,
      donatedDate: this.donatedDate
    });
  }

  editTransactionId() {
    this.edit = true;
  }

  saveTransactionId(transactionId) {
    this.presentLoader();
    this.donationApproveService.donationId = this.transactionDetails.ID;
    const formData = new FormData();
    formData.append("transaction_id", transactionId);
    this.donationApproveService.put(formData).subscribe(
      data => {
        this.dismissLoader();
        this.alerts = [];
        this.alerts.push({
          id: 1,
          type: "success",
          message: `Transaction ID changed successfully.`
        });

        setTimeout(() => {
          this.alerts = [];
          this.closeDialog();
        }, 2000);
      },
      err => {
        this.dismissLoader();
        this.somethingWentWrong();
        this.alerts = [];
        this.alerts.push({
          id: 1,
          type: "danger",
          message: `Transaction ID was not changed.`
        });

        setTimeout(() => {
          this.alerts = [];
        }, 2000);
      }
    );
  }

  editFormSubmit(formData: FormData) {
    this.donationApproveService.donationId = this.transactionDetails.id;
    if (this.router.url.indexOf("not-Verified") != -1) {
      formData.append("status", "0");
    }
    this.donationApproveService.put(formData).subscribe(
      data => {
        this.alerts = [];
        this.alerts.push({
          id: 1,
          type: "success",
          message: `Donation form has edited successfully.`
        });
        setTimeout(() => {
          this.alerts = [];
          this.closeDialog();
        }, 2000);
      },
      err => {
        this.alerts = [];
        this.alerts.push({
          id: 1,
          type: "danger",
          message: `Transaction ID was not changed.`
        });

        setTimeout(() => {
          this.alerts = [];
        }, 2000);
      }
    );
  }

  showRecipt(reciptFormValues) {
    var reciptDetails = {
      name: this.transactionDetails.donar.firstName,
      address: this.transactionDetails.donar.userProfile.addressLine1,
      address1: this.transactionDetails.donar.userProfile.addressLine2,
      pincode: '',
      mobile: this.transactionDetails.donar.username,
      amount: this.transactionDetails.amount,
      donationId: this.transactionDetails.id,
      reciptId: reciptFormValues['reciptId'],
      bank: reciptFormValues['bank'],
      branch: reciptFormValues['branch'],
      amountWords: reciptFormValues['amountInWords'],
      donatedDate: reciptFormValues['donatedDate'],
      email: this.transactionDetails.donar.email,
      branchId: this.transactionDetails.branch.branchId,
    }

    const dialogRef = this.dialog.open(ReciptDownloadComponent, {
      width: "1000vw",
      autoFocus: false,
      maxHeight: "90vh",
      data: reciptDetails
    });

    dialogRef.afterClosed().subscribe(res => {
      this.dialogRef.close();
    });

  }

  public closeAlert(alert: any) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
